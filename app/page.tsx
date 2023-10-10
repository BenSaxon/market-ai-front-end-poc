"use client"
import { Unsubscribe, getFirestore } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import firebase_app from './firebase/config'
import { Box, Button, Center, Heading, Input, Text } from '@chakra-ui/react'
import { Product, addProduct, subscribeToProducts } from './firebase/products'
import ProductCard from './components/ProductCard'

export default function Home() {
  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")

  const [products, setProducts] = useState<Product[]>([])
  const db = getFirestore(firebase_app)

  const handleForm = async () => {
    if (!title) throw new Error("Error")
    const { error } = await addProduct(db, title, 0, image)

    if (error) {
      return console.log(error)
    }
  }

  useEffect(() => {
    let unsubscribe: Unsubscribe
    const subToProducts = async () => {
      return await subscribeToProducts(setProducts, db)
    }
    subToProducts()
    return () => {if (unsubscribe) unsubscribe()}
  }, [db])
  
  return (
    <main>
      <Center py="100px">

      
      <Box w="600px">
        <Heading as="h1">Merchant AI POC</Heading>
        <Input mt ="20px" value={title} type="text" onChange={(e) => setTitle(e.target.value)} placeholder='Title' />
        <Input mt ="20px" value={title} type="text" onChange={(e) => setImage(e.target.value)} placeholder='Image url' />
        <Button onClick={() => handleForm()} mt="20px">Add Product</Button>
        {products.map((p, i) => {
          return (
            <ProductCard 
              mt="20px"
              key={p.id + "-" + i}
              title={p.title}
              quantitySold={p.quantitySold}
              imageUrl={p.imageUrl || "https://i1.wp.com/www.splashoftaste.com/wp-content/uploads/2022/05/dirty-martini-7-2.jpg"}
            />
          )
        })}
      </Box>
      </Center>
    </main>
  )
}
