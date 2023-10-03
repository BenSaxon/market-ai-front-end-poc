import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Merchant AI</h1>
        <p>Ground breaking new app that harnesses the power of AI to excel your business potential.</p>
      </div>
    </main>
  )
}
