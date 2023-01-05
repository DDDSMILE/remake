import "./detailModal.scss";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  staggerOne,
  modalOverlayVariants,
  modalVariants,
  modalFadeInUpVariants,
} from "../../motionUtils";
import { hideModalDetail } from "../../redux/modal/modal.actions";
import { useDispatch, useSelector } from "react-redux";
import {
  selectModalContent,
  selectModalState,
} from "../../redux/modal/modal.selectors";
import { BASE_IMG_URL, FALLBACK_IMG_URL } from "../../requests";
import { VscChromeClose } from "react-icons/vsc";
import { capitalizeFirstLetter, dateToYearOnly } from "../../utils";
import { FaMinus, FaPlay, FaPlus } from "react-icons/fa";
import {
  addToFavourites,
  removeFromFavourites,
} from "../../redux/favourites/favourites.actions";
import useOutsideClick from "../../hooks/useOutsideClick";
import Comment from "../Comment/Comment";
import { db } from "../../firebase/firebaseUtils";
import { selectCurrentUser } from "../../redux/auth/auth.selectors";
import axios from "axios";
import { useAlert } from "react-alert";

const DetailModal = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const modalClosed = useSelector(selectModalState);
  const modalContent = useSelector(selectModalContent);
  const [commentById, set_commentById] = useState([]);
  const handleModalClose = () => dispatch(hideModalDetail());
  const currentUser = useSelector(selectCurrentUser);
  const {
    id,
    overview,
    fallbackTitle,
    backdrop_path,
    release_date,
    first_air_date,
    vote_average,
    original_language,
    adult,
    genresConverted,
    isFavourite,
  } = modalContent;
  const joinedGenres = genresConverted
    ? genresConverted.join(", ")
    : "Not available";
  const maturityRating =
    adult === undefined
      ? "Not available"
      : adult
      ? "Suitable for adults only"
      : "Suitable for all ages";
  const reducedDate = release_date
    ? dateToYearOnly(release_date)
    : first_air_date
    ? dateToYearOnly(first_air_date)
    : "Not Available";
  const modalRef = useRef();
  const getAllComment = async () => {
    const comments = await db.collection("comment").get();
    const arr = [];
    comments.docs.forEach((comment) => {
      if (comment.data()?.movieId == id) {
        const obj = { idComment: comment.id, ...comment.data() };
        arr.push(obj);
      }
    });
    return arr;
  };
  const getAllCommentchild = async () => {
    const comments = await db.collection("comment_child").get();
    const arr = [];
    comments.docs.forEach((comment) => {
      const obj = { id: comment.id, ...comment.data() };
      arr.push(obj);
    });
    return arr;
  };
  const getAllLike = async () => {
    const likes = await db.collection("like").get();
    const arr = [];
    likes.docs.forEach((like) => {
      const obj = { id: like.id, ...like.data() };
      arr.push(obj);
    });
    return arr;
  };
  const getAllDisLike = async () => {
    const likes = await db.collection("dislike").get();
    const arr = [];
    likes.docs.forEach((like) => {
      const obj = { id: like.id, ...like.data() };
      arr.push(obj);
    });
    return arr;
  };
  const getList = () => {
    getAllComment().then(async (res) => {
      const commenChild = await getAllCommentchild();
      const like = await getAllLike();
      const disLikeCm = await getAllDisLike();
      const result = res.reduce((prevState, currentState) => {
        const comments = commenChild.map((c) => {
          if (c.parent_id == currentState?.idComment) {
            return c;
          }
        });
        const likesCm = like.filter((l) => {
          if (l.comment_id == currentState?.idComment) {
            return l;
          }
        });
        const disLikesCm = disLikeCm.filter((l) => {
          if (l.comment_id == currentState?.idComment) {
            return l;
          }
        });
        const isCheckLike = like.some(
          (l) =>
            (l.comment_id == currentState?.idComment && l.user_id) ==
            currentUser?.id
        );
        const isCheckDisLike = disLikesCm.some(
          (l) =>
            (l.comment_id == currentState?.idComment && l.user_id) ==
            currentUser?.id
        );
        const newComment = {
          ...currentState,
          commentChildList: comments,
          like: likesCm?.length,
          disLike: disLikesCm?.length,
          isLike: isCheckLike,
          isDisLike: isCheckDisLike,
        };
        prevState.push(newComment);
        return [...prevState];
      }, []);
      setTimeout(() => {
        set_commentById([...result]);
      }, 1000);
    });
    return new Promise((res) => {
      setTimeout(() => {
        res("");
      }, 1000);
    });
  };
  useEffect(() => {
    getList();
  }, [id]);
  const handleAdd = (event) => {
    event.stopPropagation();
    dispatch(addToFavourites({ ...modalContent, isFavourite }));
  };
  const handleRemove = (event) => {
    event.stopPropagation();
    dispatch(removeFromFavourites({ ...modalContent, isFavourite }));
    if (!modalClosed) handleModalClose();
  };
  const handlePlayAnimation = async (event) => {
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
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      alert.show("Movie is not trailer !");
    }
  };
  useOutsideClick(modalRef, () => {
    if (!modalClosed) handleModalClose();
  });

  return (
    <AnimatePresence exitBeforeEnter>
      {!modalClosed && (
        <>
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            key="modalOverlay"
            className={`Modal__overlay ${modalClosed && "Modal__invisible"}`}
          >
            <motion.div
              key="modal"
              variants={modalVariants}
              ref={modalRef}
              className={`Modal__wrp ${modalClosed && "Modal__invisible"}`}
            >
              <div className="l_w">
                <motion.button
                  className="Modal__closebtn"
                  onClick={handleModalClose}
                >
                  <VscChromeClose />
                </motion.button>
                <div className="Modal__image--wrp">
                  <div className="Modal__image--shadow" />
                  <img
                    className="Modal__image--img"
                    src={
                      backdrop_path
                        ? `${BASE_IMG_URL}/${backdrop_path}`
                        : FALLBACK_IMG_URL
                    }
                    alt={fallbackTitle}
                  />
                  <div className="Modal__image--buttonswrp">
                    <Link
                      className="Modal__image--button"
                      onClick={handlePlayAnimation}
                      to={`#`}
                    >
                      <FaPlay />
                      <span>Play</span>
                    </Link>
                    {!isFavourite ? (
                      <button
                        className="Modal__image--button-circular"
                        onClick={handleAdd}
                      >
                        <FaPlus />
                      </button>
                    ) : (
                      <button
                        className="Modal__image--button-circular"
                        onClick={handleRemove}
                      >
                        <FaMinus />
                      </button>
                    )}
                  </div>
                </div>
                <motion.div
                  variants={staggerOne}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="Modal__info--wrp"
                >
                  <motion.h3
                    variants={modalFadeInUpVariants}
                    className="Modal__info--title"
                  >
                    {fallbackTitle}
                  </motion.h3>
                  <motion.p
                    variants={modalFadeInUpVariants}
                    className="Modal__info--description"
                  >
                    {overview}
                  </motion.p>
                  <motion.hr
                    variants={modalFadeInUpVariants}
                    className="Modal__info--line"
                  />
                  <motion.h4
                    variants={modalFadeInUpVariants}
                    className="Modal__info--otherTitle"
                  >
                    Info on <b>{fallbackTitle}</b>
                  </motion.h4>
                  <motion.div
                    variants={modalFadeInUpVariants}
                    className="Modal__info--row"
                  >
                    <span className="Modal__info--row-label">Genres: </span>
                    <span className="Modal__info--row-description">
                      {joinedGenres}
                    </span>
                  </motion.div>
                  <motion.div
                    variants={modalFadeInUpVariants}
                    className="Modal__info--row"
                  >
                    <span className="Modal__info--row-label">
                      {release_date ? "Release date: " : "First air date: "}
                    </span>
                    <span className="Modal__info--row-description">
                      {reducedDate}
                    </span>
                  </motion.div>
                  <motion.div
                    variants={modalFadeInUpVariants}
                    className="Modal__info--row"
                  >
                    <span className="Modal__info--row-label">
                      Average vote:{" "}
                    </span>
                    <span className="Modal__info--row-description">
                      {vote_average || "Not available"}
                    </span>
                  </motion.div>
                  <motion.div
                    variants={modalFadeInUpVariants}
                    className="Modal__info--row"
                  >
                    <span className="Modal__info--row-label">
                      Original language:{" "}
                    </span>
                    <span className="Modal__info--row-description">
                      {capitalizeFirstLetter(original_language)}
                    </span>
                  </motion.div>
                  <motion.div
                    variants={modalFadeInUpVariants}
                    className="Modal__info--row"
                  >
                    <span className="Modal__info--row-label">
                      Age classification:{" "}
                    </span>
                    <span className="Modal__info--row-description">
                      {maturityRating}
                    </span>
                  </motion.div>
                </motion.div>
              </div>
              <Comment
                movieId={id}
                commentList={[...commentById]}
                getList={getList}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;
