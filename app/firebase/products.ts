"use client"
import { addDoc, collection, Timestamp, onSnapshot, query, DocumentChange, DocumentData, Firestore } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

export const addProduct = async (db: Firestore, title: string, quantity: number, image: string) => {
    let result = null;
    let error = null;

    try {
        result = await addDoc(collection(db, 'products'), {
            title: title,
			quantitySold: quantity,
            created: Timestamp.fromDate(new Date()),
			imageUrl: image
        });
    } catch (e) {
        error = e;
    }

    return { result, error };
}

export interface Product {
    id?: string
    title: string
	quantitySold: number
    created: Timestamp
	imageUrl?: string
}
export const subscribeToProducts = async (setProducts: Dispatch<SetStateAction<Product[]>>, db: Firestore) => {
	console.log("hi")
	const products: Product[] = [];
	const productCol = collection(db, 'products');
	const subscribe = onSnapshot(
		query(
			productCol),
		(snapshot) => {
			const changes = snapshot.docChanges() as DocumentChange<DocumentData>[];
			console.log(snapshot)
			changes.forEach((change) => {
				const docId = change.doc.id;
                console.log(docId)
				const w = {
					id: docId,
					title: change.doc.data().name,
					quantitySold: change.doc.data().quantitySold,
					created: change.doc.data().created,
					...change.doc.data()
				};
				if (change.type === 'modified') {
					// Find the document in the array using the unique identifier (docId)
					const index = products.findIndex((doc) => doc.id === docId);

					if (index !== -1) {
						// If the document is found, replace its contents with the updated data
						products[index] = w;
					} else {
						// If the document is not found, add it to the array
						products.push(w);
					}
				} else if (change.type === 'removed') {
					const index = products.findIndex((doc) => doc.id === docId);

					if (index !== -1) {
						// If the document is found, replace its contents with the updated data
						products.splice(index, 1);
					}
				} else if (change.type === 'added') {
					products.push(w);
				}
                setProducts([...products]);
			});
		}
	);
	return subscribe;
};