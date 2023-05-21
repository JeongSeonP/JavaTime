import { useAuthState } from "react-firebase-hooks/auth";
import {
  CommentProp,
  UpdateCommentProp,
  auth,
  updateComment,
} from "../api/firebase";
import Dropdown from "./Dropdown";
import { useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import CommentInput from "./CommentInput";

interface Prop {
  storeId: string;
  reviewId: string;
  comment: CommentProp;
}

const Comments = ({ storeId, reviewId, comment }: Prop) => {
  const [user] = useAuthState(auth);
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);

  const { mutate: commentMutate } = useMutation(updateComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["reviewInfo", storeId]);
    },
  });

  const handleRevision = (commentId: number) => {
    setEditMode(true);
  };

  const handleDeleteComment = (commentId: number) => {
    if (storeId) {
      const document: UpdateCommentProp = {
        newDoc: null,
        storeId: storeId,
        reviewId: reviewId,
        commentId: commentId,
        newText: null,
      };
      commentMutate(document);
    }
  };
  return (
    <li
      key={comment.commentId}
      className="text-right px-2 py-0 md:indent-3 bg-[#faf5f0] rounded-xl shadow-sm my-1"
    >
      <div className="flex justify-between items-center  pl-2 rounded-xl text-[11px] text-neutral-500">
        <span className="inline-block">
          {comment.userInfo.displayName ?? comment.userInfo.email}
        </span>
        <div className="flex items-center">
          {comment.isRevised ? (
            <span className="italic mr-1 text-neutral-400 text-[10px]">
              (편집됨)
            </span>
          ) : null}
          <span className="text-[10px]">{comment.date}</span>
          {user?.uid === comment.userInfo.uid ? (
            <Dropdown>
              <li>
                <div
                  onClick={() => handleRevision(comment.commentId)}
                  className="text-xs w-14 shrink-0"
                >
                  수정
                </div>
              </li>
              <li className="px-0 text-error">
                <div
                  onClick={() => handleDeleteComment(comment.commentId)}
                  className="text-xs w-14 shrink-0"
                >
                  삭제
                </div>
              </li>
            </Dropdown>
          ) : null}
        </div>
      </div>
      {editMode ? (
        <CommentInput
          commentId={comment.commentId}
          info={{ storeId: storeId, reviewId: reviewId }}
          inputEditor={setEditMode}
        />
      ) : (
        <p className="text-left mx-2">{comment.text}</p>
      )}

      <div className="divider my-0"></div>
    </li>
  );
};

export default Comments;
