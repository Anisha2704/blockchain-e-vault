# Blockchain Fingerprinting & Verification Flow

## Step-by-Step Execution Sequence

### Phase 1: Registration Flow (Uploading a Document)

```
[User Uploads File] 
       │
       ▼
[Backend receives file bytes]
       │
       ▼
[hashService.generateFileHash(filePath)] ──► SHA-256 Digest (64 Hex Chars)
       │
       ▼
[MongoDB Stores Metadata] (Title, Category, File Reference, Hash)
       │
       ▼
[ethers.js Signer invokes Smart Contract]
       │
       ▼
[DocumentRegistry.sol -> registerDocument(docId, sha256Hash)]
       │
       ▼
[Ethereum Block Mined & Event Emitted: DocumentRegistered]
       │
       ▼
[Backend saves Tx Hash & Block Timestamp to DB]
```

---

### Phase 2: Verification Flow (Proving Integrity)

```
[User enters Doc ID & Uploads Test File]
       │
       ▼
[Backend computes SHA-256 Hash of uploaded test file]
       │
       ▼
[Backend queries Smart Contract -> verifyDocument(docId, newHash)]
       │
       ▼
[Smart Contract compares stored docHash with uploaded newHash]
       │
 ┌─────┴─────────────────────────────────────────┐
 │                                               │
 ▼                                               ▼
[Hashes Match (isMatch = true)]       [Hashes Differ (isMatch = false)]
 │                                               │
 ▼                                               ▼
✅ "DOCUMENT VERIFIED - ORIGINAL"        ❌ "VERIFICATION FAILED"
 (File content is authentic)             (File modified/tampered)
```

---

## Technical Edge Cases Handled

1. **Renaming File**: If a user renames `Degree.pdf` to `MyDegree_Final.pdf` without modifying any text or bytes inside the file, SHA-256 hash remains 100% identical and verification **SUCCEEDS**.
2. **Single Byte Modification**: If even 1 comma or pixel is modified in the document, SHA-256 avalanche effect generates a completely different hash string and verification **FAILS**.
3. **Local File Deletion**: If a user deletes the local file copy from the database, the smart contract record remains on Ethereum forever, serving as proof that the document existed at that timestamp.
