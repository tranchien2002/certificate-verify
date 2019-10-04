package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/lib/cid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct {
}

type Subject struct {
	SubjectID       string
	Name            string
	TeacherUsername string
}

type Teacher struct {
	Username    string
	Fullname    string
	Address     string
	PhoneNumber string
}

type Student struct {
	Username    string
	Fullname    string
	Address     string
	PhoneNumber string
}

type Score struct {
	SubjectID       string
	StudentUsername string
	ScoreValue      float64
}

type Certificate struct {
	CertificateID   string
	SubjectID       string
	StudentUsername string
	IssueDate       string
}

func (s *SmartContract) Init(stub shim.ChaincodeStubInterface) sc.Response {
	initStudent(stub)
	initSubject(stub)
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(stub shim.ChaincodeStubInterface) sc.Response {

	function, args := stub.GetFunctionAndParameters()

	if function == "CreateStudent" {
		return CreateStudent(stub, args)
	} else if function == "CreateSubject" {
		return CreateSubject(stub, args)
	} else if function == "CreateScore" {
		return CreateScore(stub, args)
	} else if function == "CreateCertificate" {
		return CreateCertificate(stub, args)
	} else if function == "QuerySubject" {
		return QuerySubject(stub, args)
	} else if function == "QueryScore" {
		return QueryScore(stub, args)
	} else if function == "QueryStudent" {
		return QueryStudent(stub, args)
	} else if function == "QueryCertificate" {
		return QueryCertificate(stub, args)
	} else if function == "GetAllSubjects" {
		return GetAllSubjects(stub)
	} else if function == "GetAllStudents" {
		return GetAllStudents(stub)
	} else if function == "GetAllScores" {
		return GetAllScores(stub)
	} else if function == "GetAllCertificates" {
		return GetAllCertificates(stub)
	} else if function == "QueryTeacher" {
		return QueryTeacher(stub, args)
	} else if function == "GetAllTeachers" {
		return GetAllTeachers(stub)
	} else if function == "CreateTeacher" {
		return CreateTeacher(stub, args)
	}

	return shim.Error("Invalid Smart Contract function name!")
}

func QuerySubject(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	var SubjectID string

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	MSPID, err := cid.GetMSPID(stub)

	if err != nil {
		shim.Error("Error - cid.GetMSPID()")
	}

	if MSPID != "StudentMSP" && MSPID != "AcademyMSP" {
		shim.Error("WHO ARE YOU ?")
	}

	SubjectID = args[0]

	key := "Subject-" + SubjectID
	subjectAsBytes, err := stub.GetState(key)

	if err != nil {
		return shim.Error("Failed")
	}

	if subjectAsBytes == nil {
		return shim.Error("Subject does not exist - " + args[0])
	}

	return shim.Success(subjectAsBytes)
}

func QueryStudent(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	var Username string

	MSPID, err := cid.GetMSPID(stub)

	if err != nil {
		shim.Error("Error - cid.GetMSPID()")
	}

	if MSPID == "StudentMSP" {
		Username, _, err = cid.GetAttributeValue(stub, "Username")

		if err != nil {
			shim.Error("Error - Can not Get Student")
		}

	} else if MSPID == "AcademyMSP" {
		Username = args[0]
	} else {
		shim.Error("WHO ARE YOU ?")
	}

	key := "Student-" + Username
	studentAsBytes, err := stub.GetState(key)

	if err != nil {
		return shim.Error("Failed")
	}

	if studentAsBytes == nil {
		return shim.Error("Student does not exits - " + args[0])
	}

	return shim.Success(studentAsBytes)
}

func QueryTeacher(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	var Username string

	MSPID, err := cid.GetMSPID(stub)

	if err != nil {
		shim.Error("Error - cid.GetMSPID()")
	}

	if MSPID == "StudentMSP" {
		Username, _, err = cid.GetAttributeValue(stub, "Username")

		if err != nil {
			shim.Error("Error - Can not Get Student")
		}

	} else if MSPID == "AcademyMSP" {
		Username = args[0]
	} else {
		shim.Error("WHO ARE YOU ?")
	}

	key := "Teacher-" + Username
	studentAsBytes, err := stub.GetState(key)

	if err != nil {
		return shim.Error("Failed")
	}

	if studentAsBytes == nil {
		return shim.Error("Student does not exits - " + args[0])
	}

	return shim.Success(studentAsBytes)
}

func QueryScore(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	var StudentUsername string
	var SubjectID string

	MSPID, err := cid.GetMSPID(stub)

	if err != nil {
		shim.Error("Error - cid.GetMSPID()")
	}

	if MSPID == "StudentMSP" {
		StudentUsername, _, err = cid.GetAttributeValue(stub, "Username")

		if err != nil {
			shim.Error("Error - Can not Get Student")
		}

	} else if MSPID == "AcademyMSP" {
		StudentUsername = args[1]
	} else {
		shim.Error("WHO ARE YOU ?")
	}

	SubjectID = args[0]

	key := "Score-" + " " + "Subject-" + SubjectID + " " + "Student-" + StudentUsername
	scoreAsBytes, err := stub.GetState(key)

	if err != nil {
		return shim.Error("Failed")
	}

	if scoreAsBytes == nil {
		return shim.Error("Score does not exist")
	}

	return shim.Success(scoreAsBytes)
}

func QueryCertificate(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	var StudentUsername string
	var SubjectID string

	MSPID, err := cid.GetMSPID(stub)

	if err != nil {
		shim.Error("Error - cid.GetMSPID()")
	}

	if MSPID == "StudentMSP" {
		StudentUsername, _, err = cid.GetAttributeValue(stub, "Username")

		if err != nil {
			shim.Error("Error - Can not Get Student")
		}

	} else if MSPID == "AcademyMSP" {
		StudentUsername = args[0]
	} else {
		shim.Error("WHO ARE YOU ?")
	}

	SubjectID = args[1]

	key := "Certificate-" + " " + "Subject-" + SubjectID + "Student-" + StudentUsername
	certificateAsBytes, err := stub.GetState(key)

	if err != nil {
		return shim.Error("Failed")
	}

	if certificateAsBytes == nil {
		return shim.Error("Certificate does not exist")
	}

	return shim.Success(certificateAsBytes)
}

func VerifyCertificate(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	CertificateID := args[0]

	allCertificates, _ := getListCertificates(stub)

	var i int

	for i = 0; allCertificates.HasNext(); i++ {

		record, err := allCertificates.Next()

		if err != nil {
			return shim.Success(nil)
		}

		certificate := Certificate{}
		json.Unmarshal(record.Value, &certificate)

		if certificate.CertificateID == CertificateID {
			return shim.Success(record.Value)
		}
	}

	return shim.Error("Certificate-" + CertificateID + " does not exist")
}

func GetAllSubjects(stub shim.ChaincodeStubInterface) sc.Response {

	MSPID, err := cid.GetMSPID(stub)

	if err != nil {
		fmt.Println("Error - cid.GetMSPID()")
	}

	if MSPID != "StudentMSP" && MSPID != "AcademyMSP" {
		shim.Error("WHO ARE YOU ?")
	}

	allSubjects, _ := getListSubjects(stub)

	defer allSubjects.Close()

	var tlist []Subject
	var i int

	for i = 0; allSubjects.HasNext(); i++ {

		record, err := allSubjects.Next()

		if err != nil {
			return shim.Success(nil)
		}

		subject := Subject{}
		json.Unmarshal(record.Value, &subject)
		tlist = append(tlist, subject)
	}

	jsonRow, err := json.Marshal(tlist)

	if err != nil {
		return shim.Error("Failed")
	}

	return shim.Success(jsonRow)
}

func GetAllStudents(stub shim.ChaincodeStubInterface) sc.Response {
	MSPID, err := cid.GetMSPID(stub)

	if err != nil {
		shim.Error("Error - cide.GetMSPID()")
	}

	if MSPID != "AcademyMSP" {
		return shim.Error("WHO ARE YOU ?")
	}

	allStudents, _ := getListStudents(stub)

	defer allStudents.Close()

	var tlist []Student
	var i int

	for i = 0; allStudents.HasNext(); i++ {

		record, err := allStudents.Next()

		if err != nil {
			return shim.Success(nil)
		}

		student := Student{}
		json.Unmarshal(record.Value, &student)
		tlist = append(tlist, student)
	}

	jsonRow, err := json.Marshal(tlist)

	if err != nil {
		return shim.Error("Failed")
	}

	return shim.Success(jsonRow)
}

func GetAllTeachers(stub shim.ChaincodeStubInterface) sc.Response {
	MSPID, err := cid.GetMSPID(stub)

	if err != nil {
		shim.Error("Error - cide.GetMSPID()")
	}

	if MSPID != "AcademyMSP" {
		return shim.Error("WHO ARE YOU ?")
	}

	allTeachers, _ := getListTeachers(stub)

	defer allTeachers.Close()

	var tlist []Teacher
	var i int

	for i = 0; allTeachers.HasNext(); i++ {

		record, err := allTeachers.Next()

		if err != nil {
			return shim.Success(nil)
		}

		teacher := Teacher{}
		json.Unmarshal(record.Value, &teacher)
		tlist = append(tlist, teacher)
	}

	jsonRow, err := json.Marshal(tlist)

	if err != nil {
		return shim.Error("Failed")
	}

	return shim.Success(jsonRow)
}

func GetAllScores(stub shim.ChaincodeStubInterface) sc.Response {
	var allScores shim.StateQueryIteratorInterface
	MSPID, err := cid.GetMSPID(stub)

	if err != nil {
		shim.Error("Error - cide.GetMSPID()")
	}

	allScores, err = getListScores(stub)

	if err != nil {
		shim.Error("Error - Can not Get Student")
	}

	defer allScores.Close()

	var tlist []Score
	var i int

	if MSPID != "StudentMSP" && MSPID != "AcademyMSP" {
		shim.Error("WHO ARE YOU ?")
	} else if MSPID == "StudentMSP" {
		Username, _, err := cid.GetAttributeValue(stub, "Username")

		if err != nil {
			shim.Error("Error - Can not Get Student")
		}

		for i = 0; allScores.HasNext(); i++ {

			record, err := allScores.Next()

			if err != nil {
				return shim.Success(nil)
			}

			score := Score{}
			json.Unmarshal(record.Value, &score)

			if score.StudentUsername == Username {
				tlist = append(tlist, score)
			}
		}

	} else {

		for i = 0; allScores.HasNext(); i++ {

			record, err := allScores.Next()

			if err != nil {
				return shim.Success(nil)
			}

			score := Score{}
			json.Unmarshal(record.Value, &score)
			tlist = append(tlist, score)
		}
	}

	jsonRow, err := json.Marshal(tlist)

	if err != nil {
		return shim.Error("Failed")
	}

	return shim.Success(jsonRow)
}

func GetAllCertificates(stub shim.ChaincodeStubInterface) sc.Response {
	MSPID, err := cid.GetMSPID(stub)

	if err != nil {

		fmt.Println("Error - cide.GetMSPID()")

	}

	if MSPID != "AcademyMSP" {

		return shim.Error("WHO ARE YOU ?")

	}

	allCertificates, _ := getListCertificates(stub)

	defer allCertificates.Close()

	var tlist []Certificate
	var i int

	for i = 0; allCertificates.HasNext(); i++ {

		record, err := allCertificates.Next()

		if err != nil {

			return shim.Success(nil)

		}

		certificate := Certificate{}
		json.Unmarshal(record.Value, &certificate)
		tlist = append(tlist, certificate)
	}

	jsonRow, err := json.Marshal(tlist)

	if err != nil {
		return shim.Error("Failed")
	}

	return shim.Success(jsonRow)
}

func main() {

	err := shim.Start(new(SmartContract))

	if err != nil {
		fmt.Printf("Error createing new Smart Contract: %s", err)
	}
}
