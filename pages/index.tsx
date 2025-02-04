import { useCallback, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card } from "@/components/Card"
import {
  BackgroundColorBlur,
  BackgroundGridPattern,
  PageLayout,
} from "@/components/Layouts"
import { NamespaceSelector } from "@/components/NamespaceInput"
import { PineconeQuery } from "@/components/query/PineconeQuery"
import { FileUpload } from "@/components/train/FileUpload"
import { UrlScraper } from "@/components/train/UrlScraper"

function ToggleHeading({ text, embedding }) {
  const activeHeading = text == embedding
  return (
    <h1
      className={cn(
        " my-6 font-aboreto text-3xl transition duration-300 sm:text-6xl",
        activeHeading ? "text-mauve-12" : "text-mauve-8"
      )}
    >
      {text}
    </h1>
  )
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.02 } },
}

export default function Pinecone() {
  const [embedding, setEmbedding] = useState("TRAIN")
  const [namespace, setNamespace] = useState("")
  const [animateOnce, setAnimateOnce] = useState(true)
  const handleNamespaceSelect = useCallback((selectedNamespace) => {
    console.log("Selected namespace:", selectedNamespace)
    setNamespace(selectedNamespace)
  }, [])

  function toggleEmbedding() {
    setEmbedding(embedding === "TRAIN" ? "QUERY" : "TRAIN")
    setAnimateOnce(false)
  }

  const imageVariants = {
    rotate: {
      rotateY: 90,
    },
  }

  return (
    <PageLayout>
      <div className="   flex flex-col items-center  gap-3 px-3">
        <div className="z-30 my-6">
          <div className=" flex items-center justify-center md:gap-3">
            <ToggleHeading text="Train" embedding={embedding} />
            <button
              className="transition duration-150 hover:scale-105"
              onClick={toggleEmbedding}
            >
              <motion.img
                className={cn(animateOnce ? "animate-pulse" : "")}
                alt={embedding}
                src={
                  embedding === "TRAIN"
                    ? "/logo-down-indigo.svg"
                    : "/merc-logo-down-aqua.svg"
                }
                variants={imageVariants}
                animate={{ rotateX: embedding === "TRAIN" ? 0 : 0 }}
                height={175}
                width={175}
              />
            </button>

            <div className="flex flex-col items-center justify-center">
              <ToggleHeading text="Ask" embedding={embedding} />
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col items-center">
          <div className="mb-5 items-center md:max-w-2xl">
            <div className="w-full">
              <NamespaceSelector
                newNamespace={namespace}
                onNamespaceSelect={handleNamespaceSelect}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {embedding === "TRAIN" ? (
              <motion.div
                key={"TRAIN"}
                className="  flex w-full flex-col items-center"
                initial="hidden"
                animate="visible"
                // layout
                exit="exit"
                variants={fadeIn}
              >
                <p className=" mt-2  max-w-lg text-center text-neutral-800 dark:text-neutral-200 md:text-lg">
                  Set a pinecone <span className="font-bold"> namespace</span>{" "}
                  and create vector embeddings by
                  <span className="font-bold"> uploading</span> files or{" "}
                  <span className="font-bold"> sraping</span> websites
                </p>
                <div className="flex flex-col items-center justify-between md:mt-6 md:flex-row md:items-start ">
                  <div className="  pt-4 md:mx-4 md:mt-0 md:max-w-2xl">
                    <div className="  w-full">
                      <Card
                        cardDetails={{
                          name: "Upload",
                          description:
                            "Upload your pdf to Pinecone as a vector",
                        }}
                      >
                        <FileUpload namespace={namespace} />
                      </Card>
                    </div>
                  </div>

                  <div className=" pt-4 md:mx-4 md:mt-0 md:max-w-2xl">
                    <div className=" w-full">
                      <Card
                        cardDetails={{
                          name: "Scrape",
                          description: "Scrape URLs to generate embeddings",
                        }}
                      >
                        <UrlScraper namespace={namespace} />
                      </Card>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className=" flex w-full flex-col items-center ">
                <p className="mb-3 mt-2 max-w-lg text-center text-neutral-800 dark:text-neutral-200 md:text-lg">
                  Query your newly trained ai. Leverage the embedded knowledge
                  provided by you.
                </p>

                <PineconeQuery namespace={namespace} />
              </div>
            )}
          </AnimatePresence>

          <div className="absolute inset-0 -z-10 overflow-hidden ">
            <BackgroundGridPattern />
          </div>
          <BackgroundColorBlur />
        </div>
      </div>
    </PageLayout>
  )
}

// export async function getServerSideProps() {
//   const response = await fetch("/api/stats")
//   const data = await response.json()

//   return {
//     props: {
//       data,
//     },
//   }
// }
