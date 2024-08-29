import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
//import documentSafeContract from "../../artifacts/contracts/DocumentSafe.sol/DocumentSafe.json";

import "./index.css";

function App() {
  const [provider, setProvider] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(undefined);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const signer = provider.getSigner();
          const accounts = await provider.listAccounts();
          const contract = new ethers.Contract(
            documentSafeContract.address,
            documentSafeContract.abi,
            signer
          );

          setProvider(provider);
          setAccounts(accounts);
          setContract(contract);
          setLoading(false);
        } else {
          throw new Error("Please install MetaMask.");
        }
      } catch (error) {
        console.error("Error while loading the application: ", error);
        setError("Error while loading the application.");
      }
    };

    init();
  }, []);

  const handleStoreDocument = async () => {
    try {
      const documentDetails = JSON.stringify({
        name,
        age,
        occupation,
        address,
        zipCode,
      });

      const tx = await contract.storeDocument(documentDetails);
      await tx.wait();
      alert("Document stored successfully!");
      setName("");
      setAge("");
      setOccupation("");
      setAddress("");
      setZipCode("");
    } catch (error) {
      console.error("Error while storing the document: ", error);
      alert("Error while storing the document.");
    }
  };

  const loadDocuments = async () => {
    try {
      const userDocuments = await contract.getUserDocuments(accounts[0]);
      const documentsData = await Promise.all(
        userDocuments.map(async (documentId) => {
          const documentData = await contract.getDocumentDetails(documentId);
          return { ...documentData, documentId };
        })
      );
      setDocuments(documentsData);
    } catch (error) {
      console.error("Error while loading documents: ", error);
      setError("Error while loading documents.");
    }
  };

  useEffect(() => {
    if (contract && accounts.length > 0) {
      loadDocuments();
    }
  }, [contract, accounts]);

  return (
    <div className="min-h-screen bg-dark-pink text-white p-8">
      <>
        <button
          className="bg-pink-500 text-white px-4 py-2 rounded mb-4"
          onClick={() =>
            window.ethereum.request({ method: "eth_requestAccounts" })
          }
        >
          Connect Wallet
        </button>
      </>

      <div>
        <h1 className="text-3xl font-bold mb-4">Digital Document Safe</h1>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Store a New Document</h2>
          <div className="flex flex-col mb-4">
            <label htmlFor="name" className="mb-1">
              Name:
            </label>
            <input
              type="text"
              id="name"
              className="p-2 border rounded text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="age" className="mb-1">
              Age:
            </label>
            <input
              type="text"
              id="age"
              className="p-2 border rounded text-black"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="occupation" className="mb-1">
              Occupation:
            </label>
            <input
              type="text"
              id="occupation"
              className="p-2 border rounded text-black"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="address" className="mb-1">
              Address:
            </label>
            <input
              type="text"
              id="address"
              className="p-2 border rounded text-black"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="zipCode" className="mb-1">
              Zip Code:
            </label>
            <input
              type="text"
              id="zipCode"
              className="p-2 border rounded text-black"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded"
            onClick={handleStoreDocument}
          >
            Store Document
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Stored Documents</h2>
          <ul className="list-disc ml-8">
            {documents.map((document) => (
              <li key={document.documentId}>
                {document.documentDetails}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
