import "./poster.scss";
import { motion } from "framer-motion";
import { posterFadeInVariants } from "../../motionUtils";
import { BASE_IMG_URL, FALLBACK_IMG_URL } from "../../requests";
import { FaChevronDown, FaMinus, FaPlay, FaPlus } from "react-icons/fa";
import useGenreConversion from "../../hooks/useGenreConversion";
import { showModalDetail } from "../../redux/modal/modal.actions";
import { useDispatch } from "react-redux";
import {
  addToFavourites,
  removeFromFavourites,
} from "../../redux/favourites/favourites.actions";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAlert } from "react-alert";

const Poster = (result) => {
  const {
    item,
    item: {
      title,
      original_name,
      original_title,
      name,
      genre_ids,
      backdrop_path,
      id,
    },
    isFavourite,
  } = result;

  const alert = useAlert();
  let fallbackTitle = title || original_title || name || original_name;
  const genresConverted = useGenreConversion(genre_ids);
  const dispatch = useDispatch();

  const handleAdd = (event) => {
    event.stopPropagation();
    dispatch(addToFavourites({ ...item, isFavourite }));
  };
  const handleRemove = (event) => {
    event.stopPropagation();
    dispatch(removeFromFavourites({ ...item, isFavourite }));
  };

  const handleModalOpening = () => {
    dispatch(
      showModalDetail({ ...item, fallbackTitle, genresConverted, isFavourite })
    );
  };

  const handlePlayAction = async (event) => {
    event.stopPropagation();
    try {
      const result = await axios.get(`
https://api.themoviedb.org/3/movie/${id}/videos?api_key=8142ea75f701a2eb0735b5713986b770&language=en-US`);
      const data = await result.data;
      if (data?.results?.length > 0) {
        window.open(`https://www.youtube.com/watch?v=${data?.results[1]?.key}`);
      } else {
        alert.show("Movie is not trailer !");
      }
    } catch (error) {
      alert.show("Movie is not trailer !");
    }
  };

  return (
    <motion.div
      variants={posterFadeInVariants}
      className="Poster"
      onClick={handleModalOpening}
    >
      {backdrop_path ? (
        <img src={`${BASE_IMG_URL}/${backdrop_path}`} alt={fallbackTitle} />
      ) : (
        <>
          <img src={FALLBACK_IMG_URL} alt={fallbackTitle} />
          <div className="Poster__fallback">
            <span>{fallbackTitle}</span>
          </div>
        </>
      )}
      <div className="Poster__info">
        <div className="Poster__info--iconswrp">
          <Link
            className="Poster__info--icon icon--play"
            onClick={handlePlayAction}
            to={`#`}
          >
            <FaPlay />
          </Link>
          {!isFavourite ? (
            <button
              className="Poster__info--icon icon--favourite"
              onClick={handleAdd}
            >
              <FaPlus />
            </button>
          ) : (
            <button
              className="Poster__info--icon icon--favourite"
              onClick={handleRemove}
            >
              <FaMinus />
            </button>
          )}
          <button className="Poster__info--icon icon--toggleModal">
            <FaChevronDown onClick={handleModalOpening} />
          </button>
        </div>
        <div className="Poster__info--title">
          <h3>{fallbackTitle}</h3>
        </div>
        <div className="Poster__info--genres">
          {genresConverted &&
            genresConverted.map((genre) => (
              <span key={`Genre--id_${genre}`} className="genre-title">
                {genre}
              </span>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Poster;
