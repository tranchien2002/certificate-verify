package main

import (
	"encoding/json"

	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/lib/cid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// func initStudent(stub shim.ChaincodeStubInterface) sc.Response {

// 	students := []Student{
// 		Student{Username: "20156425", Fullname: "Trinh Van Tan", Subjects: nil },
// 	}

// 	for i := 0; i < len(students); i++ {
// 		studentAsBytes, _ := json.Marshal(students[i])
// 		key := "Student-" + students[i].Username

// 		fmt.Println(key)
// 		stub.PutState(key, studentAsBytes)
// 	}

// 	return shim.Success(nil)
// }

// func initTeacher(stub shim.ChaincodeStubInterface) sc.Response {

// 	teachers := []Teacher{
// 		Teacher{Username: "GV00", Fullname: "ABC", Subjects: nil},
// 	}

// 	for i := 0; i < len(teachers); i++ {
// 		teacherAsBytes, _ := json.Marshal(teachers[i])
// 		key := "Teacher-" + teachers[i].Username

// 		fmt.Println(key)
// 		stub.PutState(key, teacherAsBytes)
// 	}

// 	return shim.Success(nil)
// }

// func initSubject(stub shim.ChaincodeStubInterface) sc.Response {

// 	subjects := []Subject{
// 		Subject{SubjectID: "00", Name: "Blockchain", TeacherUsername: "GV00"},
// 		Subject{SubjectID: "01", Name: "Sawtooth", TeacherUsername: "GV01"},
// 	}

// 	for i := 0; i < len(subjects); i++ {
// 		subjectAsBytes, _ := json.Marshal(subjects[i])
// 		key := "Subject-" + subjects[i].SubjectID

// 		fmt.Println(key)
// 		stub.PutState(key, subjectAsBytes)
// 	}

// 	return shim.Success(nil)
// }

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

	Username := args[0]
	Fullname := args[1]

	key := "Student-" + Username
	checkStudentExist, err := getStudent(stub, key)

	if err == nil {
		fmt.Println(checkStudentExist)
		return shim.Error("This student already exists - " + Username)
	}

	var student = Student{Username: Username, Fullname: Fullname, Subjects: nil}

	studentAsBytes, _ := json.Marshal(student)

	stub.PutState(key, studentAsBytes)

	return shim.Success(nil)
}

func CreateTeacher(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	MSPID, err := cid.GetMSPID(stub)

	if err != nil {
		shim.Error("Error - cide.GetMSPID()")
	}

	if MSPID != "AcademyMSP" {
		shim.Error("WHO ARE YOU")
	}

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	fmt.Println("Start Create Student!")

	Username := args[0]
	Fullname := args[1]

	key := "Teacher-" + Username
	checkTeacherExist, err := getTeacher(stub, key)

	if err == nil {
		fmt.Println(checkTeacherExist)
		return shim.Error("This teacher already exists - " + Username)
	}

	var teacher = Teacher{Username: Username, Fullname: Fullname, Subjects: nil }

	studentAsBytes, _ := json.Marshal(teacher)

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

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	fmt.Println("Start Create Subject!")

	SubjectID := args[0]
	Name := args[1]

	keySubject := "Subject-" + SubjectID
	checkSubjectExist, err := getSubject(stub, keySubject)

	if err == nil {
		fmt.Println(checkSubjectExist)
		return shim.Error("This subject already exists - " + SubjectID)
	}

	var subject = Subject{SubjectID: SubjectID, Name: Name, TeacherUsername: "", Students: nil}

	subjectAsBytes, _ := json.Marshal(subject)

	stub.PutState(keySubject, subjectAsBytes)

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

	TeacherUsername, found, err := cid.GetAttributeValue(stub, "username")

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
	StudentUsername := args[1]
	ScoreValue, err := strconv.ParseFloat(args[2], 64)

	checkStudentExist, err := getStudent(stub, "Student-"+StudentUsername)

	if err != nil {
		fmt.Println(checkStudentExist)
		return shim.Error("Student dose not exist - " + StudentUsername)
	}

	checkSubjectExist, err := getSubject(stub, "Subject-"+SubjectID)

	if err != nil {
		fmt.Println(checkSubjectExist)
		return shim.Error("Subject does not exist - " + SubjectID)
	}

	if checkSubjectExist.TeacherUsername != TeacherUsername {
		shim.Error("WHO ARE YOU ?")
	}

	key := "Score-" + " " + "Subject-" + SubjectID + " " + "Student-" + StudentUsername
	checkScoreExist, err := getScore(stub, key)

	if err == nil {
		fmt.Println(checkScoreExist)
		return shim.Error("This score already exists.")
	}

	var score = Score{SubjectID: SubjectID, StudentUsername: StudentUsername, ScoreValue: ScoreValue, Certificated: false}

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

	fmt.Println("Start Create Certificate!")

	if len(args) != 4 {
		return shim.Error("Incorrecr")
	}

	CertificateID := args[0]
	SubjectID := args[1]
	StudentUsername := args[2]
	IssueDate := args[3]

	keyCertificate := "Certificate-" + CertificateID

	keyScore := "Score-" + " " + "Subject-" + SubjectID + " " + "Student-" + StudentUsername

	score, err := getScore(stub, keyScore)

	if err != nil {

		return shim.Error("Score dose not exist")

	} else {

		score.Certificated = true

		scoreAsBytes, _ := json.Marshal(score)

		stub.PutState(keyScore, scoreAsBytes)

		var certificate = Certificate{CertificateID: CertificateID, StudentUsername: StudentUsername, SubjectID: SubjectID, IssueDate: IssueDate}

		certificateAsBytes, _ := json.Marshal(certificate)

		stub.PutState(keyCertificate, certificateAsBytes)

		return shim.Success(nil)
	}
}
