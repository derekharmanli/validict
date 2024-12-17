import Head from "next/head";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import SearchHeader from "../components/search-header";
import WordBank from "../components/word-bank";
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
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <SearchHeader />

          <div className="grid gap-6 lg:grid-cols-12 mt-6">
            {/* Main Word Bank */}
            <div className="lg:col-span-8 space-y-6">
              <WordBank />
            </div>

            {/* Sidebar Tools */}
            <div className="lg:col-span-4 space-y-6">
              <Tabs defaultValue="browse" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="browse" className="flex-1">
                    Browse
                  </TabsTrigger>
                  <TabsTrigger value="concepts" className="flex-1">
                    Concepts
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="browse">
                  <DictionaryBrowser />
                </TabsContent>

                <TabsContent value="concepts">
                  <ConceptBrowser />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
