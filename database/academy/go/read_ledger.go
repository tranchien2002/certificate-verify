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

func getStudent(stub shim.ChaincodeStubInterface, StudentID string) (Student, error){
	var student Student

	studentAsBytes, err := stub.GetState(StudentID)

	if err != nil {
		return student, errors.New("Failed to get owner - " + StudentID)
	}

	if studenAsBytes == nil{
		return student, errors.New("Student does not exits - " + StudentID)
	}

	json.Unmarshal(studentAsBytes, &student)

	return student, nil
}