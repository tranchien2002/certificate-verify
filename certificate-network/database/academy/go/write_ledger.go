package main

import (
	"encoding/json"

	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/lib/cid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

func initStudent(stub shim.ChaincodeStubInterface) sc.Response {

	students := []Student{
		Student{StudentID: "20156425", Name: "Trinh Van Tan"},
	}

	for i := 0; i < len(students); i++ {
		studentAsBytes, _ := json.Marshal(students[i])
		key := "Student-" + students[i].StudentID

		fmt.Println(key)
		stub.PutState(key, studentAsBytes)
	}

	return shim.Success(nil)
}

func initSubject(stub shim.ChaincodeStubInterface) sc.Response {

	subjects := []Subject{
		Subject{SubjectID: "00", SubjectCode: "IT00", Name: "Blockchain", Weight: 3},
		Subject{SubjectID: "01", SubjectCode: "IT01", Name: "Sawtooth", Weight: 3},
	}

	for i := 0; i < len(subjects); i++ {
		subjectAsBytes, _ := json.Marshal(subjects[i])
		key := "Subject-" + subjects[i].SubjectID

		fmt.Println(key)
		stub.PutState(key, subjectAsBytes)
	}

	return shim.Success(nil)
}

func CreateStudent(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	MSPID, err := cid.GetMSPID(stub)

	if err != nil {
		shim.Error("Error - cide.GetMSPID()")
	}

	if MSPID != "StudentMSP" {
		shim.Error("WHO ARE YOU")
	}

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	fmt.Println("Start Create Student!")

	StudentID := args[0]
	Name := args[1]

	key := "Student-" + StudentID
	checkStudentExist, err := getStudent(stub, key)

	if err == nil {
		fmt.Println(checkStudentExist)
		return shim.Error("This student already exists - " + StudentID)
	}

	var student = Student{StudentID: StudentID, Name: Name}

	studentAsBytes, _ := json.Marshal(student)

	stub.PutState(key, studentAsBytes)

	return shim.Success(nil)
}

func CreateSubject(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	MSPID, err := cid.GetMSPID(stub)

	if err != nil {
		shim.Error("Error - cide.GetMSPID()")
	}

	if MSPID != "AcademyMSP" {
		shim.Error("WHO ARE YOU")
	}

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	fmt.Println("Start Create Subject!")

	SubjectID := args[0]
	SubjectCode := args[1]
	Name := args[2]
	Weight, err := strconv.Atoi(args[3])

	key := "Subject-" + SubjectID
	checkSubjectExist, err := getSubject(stub, key)

	if err == nil {
		fmt.Println(checkSubjectExist)
		return shim.Error("This subject already exists - " + SubjectID)
	}

	var subject = Subject{SubjectID: SubjectID, SubjectCode: SubjectCode, Name: Name, Weight: Weight}

	subjectAsBytes, _ := json.Marshal(subject)

	stub.PutState(key, subjectAsBytes)

	return shim.Success(nil)
}

func CreateScore(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	MSPID, err := cid.GetMSPID(stub)

	if err != nil {
		fmt.Println("Error - cide.GetMSPID()")
	}

	if MSPID != "AcademyMSP" {
		return shim.Error("You Are Not Teacher!")
	}

	TeacherID, found, err := cid.GetAttributeValue(stub, "TeacherID")

	if err != nil {
		shim.Error("Error - cide.GetMSPID()?")
	}

	if found == false {
		shim.Error("WHO ARE YOU ?")
	}

	fmt.Println("Start Create Score!")

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	SubjectID := args[0]
	StudentID := args[1]
	ScoreValue, err := strconv.ParseFloat(args[2], 64)

	checkStudentExist, err := getStudent(stub, "Student-"+StudentID)

	if err != nil {
		fmt.Println(checkStudentExist)
		return shim.Error("Student dose not exist - " + StudentID)
	}

	checkSubjectExist, err := getSubject(stub, "Subject-"+SubjectID)

	if err != nil {
		fmt.Println(checkSubjectExist)
		return shim.Error("Subject does not exist - " + SubjectID)
	}

	key := "Score-" + " " + "Subject-" + SubjectID + " " + "Student-" + StudentID
	checkScoreExist, err := getScore(stub, key)

	if err == nil {
		fmt.Println(checkScoreExist)
		return shim.Error("This score already exists.")
	}

	var score = Score{SubjectID: SubjectID, StudentID: StudentID, ScoreValue: ScoreValue, CreateBy: TeacherID}

	scoreAsBytes, _ := json.Marshal(score)

	stub.PutState(key, scoreAsBytes)

	return shim.Success(nil)
}

func CreateCertificate(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	MSPID, err := cid.GetMSPID(stub)

	if err != nil {
		shim.Error("Error - cide.GetMSPID()")
	}

	if MSPID != "AcademyMSP" {
		return shim.Error("You Are Not Teacher!")
	}

	TeacherID, found, err := cid.GetAttributeValue(stub, "TeacherID")

	if err != nil {
		shim.Error("Error - Get TeacherID")
	}

	if found == false {
		shim.Error("WHO ARE YOU ?")
	}

	fmt.Println("Start Create Certificate!")

	if len(args) != 1 {
		return shim.Error("Incorrecr")
	}

	StudentID := args[0]

	allSubjects, _ := getListSubjects(stub)

	var i int
	var sumScore float64
	var sumWeight int

	for i = 0; allSubjects.HasNext(); i++ {

		record, err := allSubjects.Next()

		if err != nil {
			return shim.Success(nil)
		}

		subject := Subject{}
		json.Unmarshal(record.Value, &subject)

		score, err := getScore(stub, "Score-"+" "+"Subject-"+subject.SubjectID+" "+"Student-"+StudentID)

		if err != nil {
			fmt.Println(score)
			return shim.Error("Score of Subject-" + subject.SubjectID + " does not exist")
		}

		sumWeight += subject.Weight
		sumScore += (score.ScoreValue * float64(subject.Weight))
	}

	average := sumScore / float64(sumWeight)

	var certificate = Certificate{StudentID: StudentID, Average: average, CreateBy: TeacherID}

	key := "Certificate-" + " " + "Student-" + StudentID

	certificateAsBytes, _ := json.Marshal(certificate)

	stub.PutState(key, certificateAsBytes)

	return shim.Success(nil)

}
