import React from "react";
import styles from "./ReviewItem.module.scss";
import { Review } from "@/types/types";
import Avatar from "@/components/avatar/Avatar";

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <div className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <Avatar avatarId={review.student_avatar} size={32} />
        <div>
          <h4>
            {review.student_name} {review.student_surname}
          </h4>
          <span>{review.rate.toFixed(1)} / 5.0</span>
        </div>
      </div>
      <p>{review.comment}</p>
    </div>
  );
};

export default ReviewItem;
