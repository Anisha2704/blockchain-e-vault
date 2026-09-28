const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DocumentRegistry Smart Contract", function () {
  let contract;
  let owner;
  let addr1;

  const sampleDocId = "DOC-2026-001";
  const sampleHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  const alteredHash = "1110c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
    contract = await DocumentRegistry.deploy();
    await contract.waitForDeployment();
  });

  it("Should deploy with 0 total documents", async function () {
    expect(await contract.totalDocuments()).to.equal(0);
  });

  it("Should register a document successfully and emit an event", async function () {
    const tx = await contract.registerDocument(sampleDocId, sampleHash);
    const receipt = await tx.wait();

    expect(await contract.totalDocuments()).to.equal(1);
    expect(await contract.documentExists(sampleDocId)).to.be.true;

    // Check event emission
    const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'DocumentRegistered');
    expect(event).to.not.be.undefined;
    expect(event.args[1]).to.equal(sampleDocId);
    expect(event.args[2]).to.equal(sampleHash);
    expect(event.args[3]).to.equal(owner.address);
  });

  it("Should prevent duplicate document registration", async function () {
    await contract.registerDocument(sampleDocId, sampleHash);
    await expect(
      contract.registerDocument(sampleDocId, sampleHash)
    ).to.be.revertedWith("Document ID already registered");
  });

  it("Should retrieve registered document details correctly", async function () {
    await contract.registerDocument(sampleDocId, sampleHash);
    const doc = await contract.getDocument(sampleDocId);

    expect(doc[0]).to.equal(sampleDocId);
    expect(doc[1]).to.equal(sampleHash);
    expect(doc[2]).to.equal(owner.address);
    expect(doc[4]).to.be.true;
  });

  it("Should correctly verify an authentic hash", async function () {
    await contract.registerDocument(sampleDocId, sampleHash);
    const result = await contract.verifyDocument(sampleDocId, sampleHash);
    
    expect(result[0]).to.be.true; // isValid
    expect(result[2]).to.equal(owner.address);
    expect(result[3]).to.equal(sampleHash);
  });

  it("Should fail verification for a modified/tampered hash", async function () {
    await contract.registerDocument(sampleDocId, sampleHash);
    const result = await contract.verifyDocument(sampleDocId, alteredHash);

    expect(result[0]).to.be.false; // isValid should be false
    expect(result[3]).to.equal(sampleHash); // original hash returned
  });
});
