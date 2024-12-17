import Head from "next/head";
import SearchHeader from "../components/search-header";
import WordList from "../components/word-list";
import Recommendations from "../components/recommendations";
import DictionaryBrowser from "../components/dictionary-browser";
import ConceptBrowser from "../components/concept-browser";

export default function Home() {
  return (
    <>
      <Head>
        <title>Word Bank</title>
        <meta
          name="description"
          content="Personal dictionary and word learning app"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <SearchHeader />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid gap-6 grid-cols-1">
                <DictionaryBrowser />
                <ConceptBrowser />
              </div>
              <WordList />
            </div>
            <div>
              <Recommendations />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
