package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"itpUtils"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
	"github.com/hyperledger/fabric/core/chaincode/shim/ext/cid"
)

func initStudent(stub shim.ChaincodeStubInterface) sc.Response {

	students := []Student{
		Student{
			StudentID: "20156245",
			Name: "Trinh Van Tan"
		}
	}


	for i := 0; i < len(students); i++ {
		studentAsBytes, _ := json.Marshal(students[i])
		keys := []string{students[i].StudentID}

		err = stub.PutState(keys, studentAsBytes)
	}

	return shim.Success(studentAsBytes)
}

func initSubject(stub shim.ChaincodeStubInterface) sc.Response {

	subjects := []Subject{
		Subject{
			SubjectID: "IT01",
			Name: "Blockchain",
			Weight: 3
		}
	}

	for i := 0; i < len(subjects); i++{
		subjectAsBytes, _ := json.Marshal(subjects[i])
		keys  := []string{subjects[i].SubjectID}

		err  = stub.PutState(keys, subjectAsBytes)
	}

	return shim.Success(subjectAsBytes)
}

func createStudent(stub shim.ChaincodeStubInterface, args []string) sc.Response{
	var err error

	fmt.Println("Start Create Student")

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expectiing 2")
	}

	StudentID := args[0]
	Name := args[1]

	checkStudentExist := getStudent(stub, StudentID)
}