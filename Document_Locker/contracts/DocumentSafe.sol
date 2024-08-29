// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ISP } from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import { Attestation } from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import { DataLocation } from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";

/**
 * @title DocumentSafe
 * @author 0xAlex
 * @notice A contract for securely storing and verifying documents using the Sign Protocol.
 */
contract DocumentSafe is Ownable {
    ISP public spInstance;
    uint64 public schemaId;

    mapping(uint64 => DocumentData) public documents;
    mapping(address => uint64[]) public userDocuments;

    struct DocumentData {
        address owner;
        string documentDetails;
        uint64 attestationId;
        bytes[] additionalData;
    }

    event DocumentStored(uint64 documentId, address owner, string documentDetails);
    event DocumentVerified(uint64 documentId, bytes verificationData);

    constructor() Ownable(_msgSender()) {}

    function setSPInstance(address instance) external onlyOwner {
        spInstance = ISP(instance);
    }

    function setSchemaID(uint64 schemaId_) external onlyOwner {
        schemaId = schemaId_;
    }

    function storeDocument(string memory documentDetails) external {
        bytes32 documentIdBytes32 = keccak256(abi.encodePacked(_msgSender(), documentDetails));
        uint documentIdUint = uint(documentIdBytes32);
        uint64 documentId = uint64(documentIdUint);
        require(documents[documentId].attestationId == 0, "Document already exists");

        bytes;
        recipients[0] = abi.encode(_msgSender());

        Attestation memory a = Attestation({
            schemaId: schemaId,
            linkedAttestationId: 0,
            attestTimestamp: 0,
            revokeTimestamp: 0,
            attester: address(this),
            validUntil: 0,
            dataLocation: DataLocation.ONCHAIN,
            revoked: false,
            recipients: recipients,
            data: abi.encode(documentDetails)
        });

        uint64 attestationId = spInstance.attest(a, "", "", "");

        documents[documentId] = DocumentData({
            owner: _msgSender(),
            documentDetails: documentDetails,
            attestationId: attestationId,
            additionalData: new bytes 
        });

        userDocuments[_msgSender()].push(documentId);

        emit DocumentStored(documentId, _msgSender(), documentDetails);
    }

    function verifyDocument(uint64 documentId, bytes memory verificationData) external onlyOwner {
        DocumentData storage documentData = documents[documentId];
        require(documentData.attestationId != 0, "Document not found");

        documentData.additionalData.push(verificationData);

        emit DocumentVerified(documentId, verificationData);
    }

    function getDocumentDetails(uint64 documentId) external view returns (DocumentData memory) {
        DocumentData storage documentData = documents[documentId];
        require(documentData.attestationId != 0, "Document not found");
        return documentData;
    }

    function getUserDocuments(address user) external view returns (uint64[] memory) {
        return userDocuments[user];
    }
}
