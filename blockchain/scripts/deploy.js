const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting DocumentRegistry Smart Contract deployment...");

  const DocumentRegistry = await hre.ethers.getContractFactory("DocumentRegistry");
  const contract = await DocumentRegistry.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`✅ DocumentRegistry deployed successfully to: ${address}`);

  // Export contract address and ABI to backend config directory
  const backendConfigDir = path.join(__dirname, "../../backend/src/config");
  if (!fs.existsSync(backendConfigDir)) {
    fs.mkdirSync(backendConfigDir, { recursive: true });
  }

  const artifactPath = path.join(__dirname, "../artifacts/contracts/DocumentRegistry.sol/DocumentRegistry.json");
  let abi = [];
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    abi = artifact.abi;
  }

  const contractData = {
    address: address,
    abi: abi,
    network: "localhost",
    chainId: 31337,
    deployedAt: new Date().toISOString()
  };

  const targetPath = path.join(backendConfigDir, "contractDetails.json");
  fs.writeFileSync(targetPath, JSON.stringify(contractData, null, 2));
  console.log(`📄 Saved contract address and ABI to: ${targetPath}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
