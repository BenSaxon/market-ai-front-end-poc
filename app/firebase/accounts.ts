import { getFirestore, doc, setDoc, addDoc, collection, Timestamp, onSnapshot, query, DocumentChange, DocumentData, Firestore } from "firebase/firestore";
import firebase_app from "./config";
import { Dispatch, SetStateAction } from "react";

export const addAccount = async (db: Firestore, name?: string) => {
    let result = null;
    let error = null;

    try {
        result = await addDoc(collection(db, 'accounts'), {
            name: name || "Ben Saxon",
            created: Timestamp.fromDate(new Date())
        });
    } catch (e) {
        error = e;
    }

    return { result, error };
}

export interface Account {
    id?: string
    name: string
    created: Timestamp
}
export const subscribeToAccounts = async (setAccounts: Dispatch<SetStateAction<Account[]>>, db: Firestore) => {
	const accounts: Account[] = [];
	const accountCol = collection(db, 'accounts');
	const subscribe = onSnapshot(
		query(
			accountCol),
		(snapshot) => {
			const changes = snapshot.docChanges() as DocumentChange<DocumentData>[];
			changes.forEach((change) => {
				const docId = change.doc.id;
                console.log(docId)
				const w = {
					id: docId,
					name: change.doc.data().name,
					created: change.doc.data().created,
					...change.doc.data()
				};
				if (change.type === 'modified') {
					// Find the document in the array using the unique identifier (docId)
					const index = accounts.findIndex((doc) => doc.id === docId);

					if (index !== -1) {
						// If the document is found, replace its contents with the updated data
						accounts[index] = w;
					} else {
						// If the document is not found, add it to the array
						accounts.push(w);
					}
				} else if (change.type === 'removed') {
					const index = accounts.findIndex((doc) => doc.id === docId);

					if (index !== -1) {
						// If the document is found, replace its contents with the updated data
						accounts.splice(index, 1);
					}
				} else if (change.type === 'added') {
					accounts.push(w);
				}
                setAccounts([...accounts]);
			});
		}
	);
	return subscribe;
};