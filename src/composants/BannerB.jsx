import Head from 'next/head';

export default function BannerB(){
  return(
    <div className="BannerB">
      <Head>
       <title>YATTE CÔTE D'IVOIRE</title>
        <meta
           name="description"
           content="YATTE est une boutique en ligne innovante spécialisée dans la vente de produits de qualité au meilleur prix."
        />
       <meta name="robots" content="index, follow" />
       <meta name="google-site-verification" content="HNNW2yZuf8plawr_kpuLSdi1PBeJAEkzayLcGCe4xgk" />
        <link rel="canonical" href="https://yatteshop.netlify.app/" />
      </Head>
      <div className="promoA">
        <div className="promoA1s">
          Qualités et prix imbattables sur nos électromenagers
        </div>
        <div className="promoA2s">
          super Deal
        </div>
      </div>
      <div className="BAL">
        <div className="promoA3">
          -40%
        </div>
        <img src="rmb.png" alt="rmb" />
        <img src="rmba.png" alt="rmba" />
      </div>
    </div>
  )
}