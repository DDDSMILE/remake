import "./banner.scss";
import React from "react";
import { motion } from "framer-motion";
import {
  staggerOne,
  bannerFadeInLoadSectionVariants,
  bannerFadeInVariants,
  bannerFadeInUpVariants,
} from "../../motionUtils";
import { BASE_IMG_URL } from "../../requests";
import { FaPlay } from "react-icons/fa";
import { BiInfoCircle } from "react-icons/bi";
import { randomize, truncate } from "../../utils";
import { Link } from "react-router-dom";
import SkeletonBanner from "../SkeletonBanner/SkeletonBanner";
import { useDispatch, useSelector } from "react-redux";
import { showModalDetail } from "../../redux/modal/modal.actions";
import {
  selectTrendingMovies,
  selectNetflixMovies,
} from "../../redux/movies/movies.selectors";
import { selectNetflixSeries } from "../../redux/series/series.selectors";
import axios from "axios";
import { useAlert } from "react-alert";

const Banner = ({ type }) => {
  let selector;
  switch (type) {
    case "movies":
      selector = selectTrendingMovies;
      break;
    case "series":
      selector = selectNetflixSeries;
      break;
    default:
      selector = selectNetflixMovies;
      break;
  }

  const myData = useSelector(selector);
  const { loading, error, data: results } = myData;
  const finalData = results[randomize(results)];
  const fallbackTitle =
    finalData?.title || finalData?.name || finalData?.original_name;
  const description = truncate(finalData?.overview, 150);
  const dispatch = useDispatch();
  const alert = useAlert();
  const handlePlayAnimation = async (event) => {
    event.stopPropagation();
    // window.location.href = `https://www.youtube.com/watch?v=${finalData?.id}`;
    try {
      const result = await axios.get(`
https://api.themoviedb.org/3/movie/${finalData?.id}/videos?api_key=8142ea75f701a2eb0735b5713986b770&language=en-US`);
      const data = await result.data;
      if (data?.results?.length > 0) {
        window.open(`https://www.youtube.com/watch?v=${data?.results[1]?.key}`);
      } else {
        alert.show("Don't have trailer !");
      }
    } catch (error) {
      alert.show("Don't have trailer !");
    }
  };

  const handleModalOpening = () => {
    dispatch(showModalDetail({ ...finalData, fallbackTitle }));
  };
  console.log("finalData====================================");
  console.log(finalData);
  console.log("finalData====================================");
  return (
    <>
      <motion.section
        variants={bannerFadeInLoadSectionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="Banner__loadsection"
      >
        {loading && <SkeletonBanner />}
        {error && <div className="errored">Oops, an error occurred.</div>}
      </motion.section>

      {!loading && finalData && (
        <motion.header
          variants={bannerFadeInVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="Banner"
          style={{
            backgroundImage: `url(${BASE_IMG_URL}/${finalData?.backdrop_path})`,
          }}
        >
          <motion.div
            className="Banner__content"
            variants={staggerOne}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.h1
              variants={bannerFadeInUpVariants}
              className="Banner__content--title"
            >
              {fallbackTitle}
            </motion.h1>
            <motion.div
              variants={bannerFadeInUpVariants}
              className="Banner__buttons"
            >
              <Link className="Banner__button" onClick={handlePlayAnimation}>
                <FaPlay />
                <span>Play</span>
              </Link>
              <button className="Banner__button" onClick={handleModalOpening}>
                <BiInfoCircle size="1.5em" />
                <span>More info</span>
              </button>
            </motion.div>
            <motion.p
              variants={bannerFadeInUpVariants}
              className="Banner__content--description"
            >
              {description}
            </motion.p>
          </motion.div>
          <div className="Banner__panel" />
          <div className="Banner__bottom-shadow" />
        </motion.header>
      )}
    </>
  );
};

export default React.memo(Banner);
