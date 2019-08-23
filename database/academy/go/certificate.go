package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
	// "github.com/hyperledger/fabric/core/chaincode/shim/ext/cid"
)

type SmartContract struct {
}

type Subject struct {
	SubjectID   string
	SubjectCode string
	Name        string
	Weight      int
}

type Student struct {
	StudentID string
	Name      string
}

type Score struct {
	SubjectID  string
	StudentID  string
	ScoreValue float64
}

type Certificate struct {
	StudentID string
	Average   float64
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
	}

	return shim.Error("Invalid Smart Contract function name!")
}

func QuerySubject(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	key := "Subject-" + args[0]
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

	key := "Student-" + args[0]
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

	key := "Score-" + " " + "Subject-" + args[0] + " " + "Student-" + args[1]
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

	key := "Certificate-" + " " + "Student-" + args[0]
	certificateAsBytes, err := stub.GetState(key)

	if err != nil {
		return shim.Error("Failed")
	}

	if certificateAsBytes == nil {
		return shim.Error("Certificate does not exist")
	}

	return shim.Success(certificateAsBytes)
}

func GetAllSubjects(stub shim.ChaincodeStubInterface) sc.Response {

	allSubjects, _ := getListOfSubjects(stub)

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

	allStudents, _ := getListOfStudents(stub)

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

func GetAllScores(stub shim.ChaincodeStubInterface) sc.Response {

	allScores, _ := getListOfScores(stub)

	defer allScores.Close()

	var tlist []Score
	var i int
	for i = 0; allScores.HasNext(); i++ {

		record, err := allScores.Next()
		if err != nil {
			return shim.Success(nil)
		}

		score := Score{}
		json.Unmarshal(record.Value, &score)
		tlist = append(tlist, score)
	}

	jsonRow, err := json.Marshal(tlist)
	if err != nil {
		return shim.Error("Failed")
	}

	return shim.Success(jsonRow)
}

func GetAllCertificates(stub shim.ChaincodeStubInterface) sc.Response {

	allCertificates, _ := getListOfCertificates(stub)

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
