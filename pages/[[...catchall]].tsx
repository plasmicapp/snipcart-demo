/** @format */

import * as React from "react";
import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { GetStaticPaths, GetStaticProps } from "next";

import {
  ComponentRenderData,
  PlasmicRootProvider,
} from "@plasmicapp/loader-react";
import Error from "next/error";
import { PLASMIC } from "../plasmic-init";
import Head from "next/head";

const ForceScript = "script";

export default function PlasmicLoaderPage(props: {
  plasmicData?: ComponentRenderData;
}) {
  const { plasmicData } = props;
  if (!plasmicData || plasmicData.entryCompMetas.length === 0) {
    return <Error statusCode={404} />;
  }
  return (
    <PlasmicRootProvider loader={PLASMIC} prefetchedData={plasmicData}>
      <Head>
        <ForceScript
          src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"
          type="text/javascript"
        ></ForceScript>

        <ForceScript
          type="text/javascript"
          id="snipcart"
          src="https://cdn.snipcart.com/scripts/snipcart.js"
          data-api-key="N2YxOTcyOTMtMTkxZS00ZGEyLTg3MGQtZWFmNmI3M2NkZGE4NjM3NzcxMTMzMzg2NDY5NjU2"
        ></ForceScript>

        <link
          id="snipcart-theme"
          type="text/css"
          href="https://cdn.snipcart.com/themes/base/snipcart.min.css"
          rel="stylesheet"
        />
      </Head>
      <PlasmicComponent component={plasmicData.entryCompMetas[0].name} />
    </PlasmicRootProvider>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { catchall } = context.params ?? {};
  const plasmicPath =
    typeof catchall === "string"
      ? catchall
      : Array.isArray(catchall)
      ? `/${catchall.join("/")}`
      : "/";
  const plasmicData = await PLASMIC.maybeFetchComponentData(plasmicPath);
  if (plasmicData) {
    return {
      props: { plasmicData },

      // Use revalidate if you want incremental static regeneration
      revalidate: 60,
    };
  }
  return {
    // non-Plasmic catch-all
    props: {},
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pageModules = await PLASMIC.fetchPages();
  return {
    paths: pageModules.map((mod) => ({
      params: {
        catchall: mod.path.substring(1).split("/"),
      },
    })),

    // Turn on "fallback: 'blocking'" if you would like new paths created
    // in Plasmic to be automatically available
    fallback: false,
  };
};
