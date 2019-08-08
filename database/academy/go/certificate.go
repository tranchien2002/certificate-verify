package main
impport (
	"fmt"
	"itpUtils"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
	"github.com/hyperledger/fabric/core/chaincode/shim/ext/cid"
)

type SmartContract struct {
}

type Subject struct {
	SubjectID 		string
	SubjectCode		string
	Name			string
	Weight			float64
}

type Student struct {
	StudentID		string
	Name			string
}

type Score struct {
	SubjectID string
	StudentID string
	Score 	  float64
}

type Certificate struct{
	CertificateID 	string
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
		return createStudent(stub)
	}else if function == "createSubject" {
		return createSubject(stub)
	}

	return shim.Error("Invalid Smart Contract function name!")
}