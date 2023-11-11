import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <p>
        My link <Link href="/posts/first-post">this page!</Link>
      </p>
      <section className={utilStyles.headingMd}>
        <p>TODO</p>
        <p>
          (Blah{' '}
          <a href="https://github.com/andreformento">github</a>.)
        </p>
      </section>
    </Layout>
  );
}
