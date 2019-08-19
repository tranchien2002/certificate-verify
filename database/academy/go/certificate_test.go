package main

import (
	"fmt"
	"testing"
	"strings"
	"github.com/hyperledger/fabric/core/chaincode/shim"
)

func TestInstancesCreation(test *testing.T) {
	stub := InitChaincode(test)

	StudentID := "20156246"
	SubjectID := "02"

	Invoke(test, stub, "createStudent", StudentID, "Hoang Ngoc Phuc")
	Invoke(test, stub, "createSubject", SubjectID, "IT02", "Blockchain", "3")
	Invoke(test, stub, "createSubject", "03", "IT03", "HF", "3")
	Invoke(test, stub, "createScores", SubjectID, StudentID, "10")
	Invoke(test, stub, "querySubject", "00")
	Invoke(test, stub, "getListOfSubjects", "00")
}

func InitChaincode(test *testing.T) *shim.MockStub {
	stub := shim.NewMockStub("testingStub", new(SmartContract))
	result := stub.MockInit("000", nil)

	if result.Status != shim.OK {
		test.FailNow()
	}
	return stub
}

func Invoke(test *testing.T, stub *shim.MockStub, function string, args ...string){
	cc_args := make([][]byte, 1 + len(args))
	cc_args[0] = []byte(function)

	for i, arg := range args {
		cc_args[i+1] = []byte(arg)
	}
	result := stub.MockInvoke("000", cc_args)
	fmt.Println("Call:	", function,"(", strings.Join(args, ", "),")")
	fmt.Println("RetCode:	", result.Status)
	fmt.Println("RetMsg:	", result.Message)
	fmt.Println("Payload:	", string(result.Payload))

	if result.Status != shim.OK {
		test.FailNow()
	}
}