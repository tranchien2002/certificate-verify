package main

import (
	"encoding/json"
//	"errors"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
//	"github.com/hyperledger/fabric/core/chaincode/shim/ext/cid"
)

func initStudent(stub shim.ChaincodeStubInterface) sc.Response {
	//var err error

	students := []Student{
		Student{StudentID: "20156245", Name: "Trinh Van Tan"},
	}


	for i := 0; i < len(students); i++ {
		studentAsBytes, _ := json.Marshal(students[i])
		keys := []string{students[i].StudentID}
		compositeKey, _ := stub.CreateCompositeKey("Student", keys)

		stub.PutState(compositeKey, studentAsBytes)
	}

	return shim.Success(nil)
}

func initSubject(stub shim.ChaincodeStubInterface) sc.Response {
	//var err error

	subjects := []Subject{
		Subject{SubjectID: "IT01", Name: "Blockchain", Weight: 3},
	}

	for i := 0; i < len(subjects); i++{
		subjectAsBytes, _ := json.Marshal(subjects[i])
		keys := []string{subjects[i].SubjectID}
		compositeKey, _ := stub.CreateCompositeKey("Subject", keys)

		stub.PutState(compositeKey, subjectAsBytes)
	}

	return shim.Success(nil)
}

func createStudent(stub shim.ChaincodeStubInterface, args []string) sc.Response{
	var err error

	fmt.Println("Start Create Student")

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	StudentID := args[0]
	Name := args[1]

	keys := []string{StudentID}
	compositeKey, _ := stub.CreateCompositeKey("Student", keys)

	checkStudentExist, err := getStudent(stub, compositeKey)
	if err == nil {
		fmt.Println(checkStudentExist)
		return shim.Error("This student already exists - " + compositeKey)
	}

	var student = Student{StudentID: StudentID, Name: Name}

	studentAsBytes, _:= json.Marshal(student)

	stub.PutState(args[0], studentAsBytes)

	return shim.Success(nil)
}

func createSubject(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	var err error

	fmt.Println("Start Create Subject")

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	SubjectID := args[0]
	SubjectCode := args[1]
	Name := args[2]
	Weight, err := strconv.Atoi(args[3])

	keys := []string{SubjectID}
	compositeKey, _ := stub.CreateCompositeKey("Subject", keys)

	//check if Subject exist
	checkSubjectExist, err := getSubject(stub, compositeKey)
	if err == nil {
		fmt.Println(checkSubjectExist)
		return shim.Error("This subject already exists - " + compositeKey)
	}

	var subject = Subject{SubjectID: SubjectID, SubjectCode: SubjectCode, Name: Name, Weight: Weight}

	subjectAsBytes, _ := json.Marshal(subject)

	stub.PutState(compositeKey, subjectAsBytes)

	return shim.Success(nil)
}

func createScores(stub shim.ChaincodeStubInterface, args []string)  sc.Response {
	var err error

	fmt.Println("Start Create Scores")

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	SubjectID := args[0]
	StudentID := args[1]
	Score, err := strconv.ParseFloat(args[2], 64)

	keys := []string{args[0], args[1]}
	compositeKey, _:= stub.CreateCompositeKey("Scores", keys)

	checkScoresExist, err := getScores(stub, compositeKey)
	if err == nil {
		fmt.Println(checkScoresExist)
		return shim.Error("This scores already exists - " + compositeKey)
	}

	var scores = Scores{SubjectID: SubjectID, StudentID: StudentID, Score: Score}

	scoresAsBytes, _ := json.Marshal(scores)

	stub.PutState(compositeKey, scoresAsBytes)

	return shim.Success(nil)
}
