// Import the functions you need from the SDKs you need
import { app } from "./firebase.js";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDocs, getDoc, updateDoc, collection, query, where, serverTimestamp, documentId, deleteDoc } from "firebase/firestore";
import TierDataList from "../animes.json"
import UserDataList from "../users.json"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const db = getFirestore(app)
// const userId = "abc123"
const userId = localStorage.getItem("userId");
export {
        db,
        doc,
        setDoc,
        getDoc
 }

 export async function usertest() {
  for (const userData of UserDataList) {
    userData["labels"].push("画像リスト");
    await setDoc(usersRef, userData);
  }
  // console.log("userデータ登録成功")
}

export async function registAnimeTier(animeTierModel) {
  animeTierModel.userId = userId;
  const checkQuery = query(collection(db, "tiers"), where("animeId", "==", animeTierModel.animeId), where("userId", "==", animeTierModel.userId));
  const querySnapshot = await getDocs(checkQuery);

  // console.log(querySnapshot);
  if (!querySnapshot.empty) {
    // console.log("同じデータがすでに存在するため登録をスキップ:", animeTierModel);
    return;
  }

  const tierRef = doc(collection(db, "tiers"));
  animeTierModel.createdAt = serverTimestamp();
  animeTierModel.updatedAt = serverTimestamp();
  await setDoc(tierRef, { ...animeTierModel });
  // console.log({ ...animeTierModel });
  // console.log("animetierデータ登録成功");
}

export async function registUser(userModel) {
  userModel.createdAt = serverTimestamp();
  userModel.updatedAt = serverTimestamp();
  userModel.labels = [{labelName: "画像リスト", color: '#ffffff'}];

  const usersRef = doc(collection(db, "users"), userModel.userId);
  await setDoc(usersRef, { ...userModel });
  // console.log("userデータ登録成功")
}

// rowを追加、削除する際のモード
const MODE_ADD_ROW_ABOVE = 0 // 上にrow追加
const MODE_ADD_ROW_BELOW = 1 // 下にrow追加
const MODE_DELETE_ROW = 2 // row削除
const MODE_RENAME_ROW_LABEL = 3 // label変更

export async function updateUserData(mode, rowIndex, changeData) {
  const userData = await selectUserData(userId);
  const userRef = doc(db, "users", userData.userId);

  if (mode == MODE_ADD_ROW_ABOVE) {
    userData.labels.splice(rowIndex, 0, { labelName: 'New Row', color: '#ffffff' })
  } 
  else if (mode == MODE_ADD_ROW_BELOW) {
    userData.labels.splice(rowIndex+1, 0, { labelName: 'New Row', color: '#ffffff' });
  } 
  else if (mode == MODE_DELETE_ROW) {
    const preLabelName = userData.labels[rowIndex];
    userData.labels.splice(rowIndex, 1);
    deleteAllTierData(preLabelName);
  } 
  else if (mode == MODE_RENAME_ROW_LABEL) {
    const preLabelName = userData.labels[rowIndex].labelName;
    userData.labels[rowIndex].labelName = changeData;
    updateAllTierData(preLabelName, changeData);
  } else {
    userData.labels[rowIndex].color = changeData;
  }
  await updateDoc(userRef, {
      labels: userData.labels,
      updatedAt: serverTimestamp(),
  });
};

export async function selectTierData(snapshot) {
  const userQuery = query(collection(db, "users"), where(documentId(), "==", userId));
  const userResult = await getDocs(userQuery);

  let labels = [];
  userResult.forEach(doc => {
    labels = doc.data().labels || [];
  });

  let animeTierList = [];
  snapshot.forEach(doc => {
    animeTierList.push(doc.data());
  });
  
  const rows = labels.map(label => ({
    labelName: label.labelName,
    color: label.color,
    items: animeTierList
      .filter(item => item.labelName === label.labelName)
      .sort((a, b) => a.order - b.order)
}));

  // console.log(userId);
  // console.log(labels);
  // console.log(rows);
  // console.log("データを取得しました");
  return rows;
}

export async function updateTierData(newLabelName, animeId) {
  const tierQuery = query(collection(db, "tiers"), where("animeId", "==", animeId), where("userId", "==", userId));
  const tierResult = await getDocs(tierQuery);

  const tierRef = doc(db, "tiers", tierResult.docs[0].id);
  await updateDoc(tierRef, {
    labelName: newLabelName,
    updatedAt: serverTimestamp(),
  });
};

export async function updateAllTierData(preLabelName, newLabelName) {
  const tierQuery = query(collection(db, "tiers"), where("labelName", "==", preLabelName), where("userId", "==", userId));
  const tierResult = await getDocs(tierQuery);

  const updatePromises = tierResult.docs.map((element) => {
    const tierRef = doc(db, "tiers", element.id);
    return updateDoc(tierRef, {
      labelName: newLabelName,
      updatedAt: serverTimestamp(),
    });
  });

  await Promise.all(updatePromises);
};

export async function deleteTierData(animeId) {
  const tierQuery = query(collection(db, "tiers"), where("animeId", "==", animeId), where("userId", "==", userId));
  const tierResult = await getDocs(tierQuery);

  if (!tierResult) return
  const tierRef = doc(db, "tiers", tierResult.docs[0].id);
  await deleteDoc(tierRef);
}

export async function deleteAllTierData(preLabelName) {
  const tierQuery = query(collection(db, "tiers"), where("labelName", "==", preLabelName), where("userId", "==", userId));
  const tierResult = await getDocs(tierQuery);

  const deletePromises = tierResult.docs.map((element) => {
    const tierRef = doc(db, "tiers", element.id);
    return deleteDoc(tierRef);
  });

  await Promise.all(deletePromises);
};

export async function selectUserData(userId) {
  const userQuery = query(collection(db, "users"), where(documentId(), "==", userId));
  const userResult = await getDocs(userQuery);

  if (userResult.empty) {
    // console.warn("User not found:", userId);
    return null;
  }

  return userResult.docs[0].data();
};
