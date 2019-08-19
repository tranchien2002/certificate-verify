package main

import (
	"fmt"
//	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
	// "github.com/hyperledger/fabric/core/chaincode/shim/ext/cid"
)

type SmartContract struct {
}

type Subject struct {
	SubjectID 		string
	SubjectCode		string
	Name			string
	Weight			int
}

type Student struct {
	StudentID		string
	Name			string
}

type Scores struct {
	SubjectID string
	StudentID string
	Score 	  float64
}

type Certificate struct{
	StudentID 		string
	Average			float64
}

func (s *SmartContract) Init(stub shim.ChaincodeStubInterface) sc.Response{
	initStudent(stub)
	initSubject(stub)
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(stub shim.ChaincodeStubInterface) sc.Response{

	function, args := stub.GetFunctionAndParameters()

	if function == "createStudent" {
		return createStudent(stub, args)
	}else if function == "createSubject" {
		return createSubject(stub, args)
	}else if function == "createScores" {
		return createScores(stub, args)
	}else if function == "getListOfSubjects" {
		return getListOfSubjects(stub, args)
	}else if function == "querySubject" {
		return querySubject(stub, args)
	}else if function == "getListOfSubjects" {
		return getListOfSubjects(stub, args)
	}

	return shim.Error("Invalid Smart Contract function name!")
}

func querySubject(stub shim.ChaincodeStubInterface, args []string ) sc.Response{

	compositeKey, _ := stub.CreateCompositeKey("Subject", args)
	subjectAsBytes , err := stub.GetState(compositeKey)

	if err != nil {
		return shim.Error("Failed")
	}

	if subjectAsBytes == nil {
		return shim.Error("Subject does not exist - " + compositeKey)
	}

	return shim.Success(subjectAsBytes)
}

func main() {
	// create a new smart contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error createing new Smart Contract: %s", err)
	}
}