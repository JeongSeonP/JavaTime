import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import {
  CommentProp,
  UpdateCommentProp,
  auth,
  updateComment,
} from "../api/firebase";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Dispatch, SetStateAction } from "react";

interface Props {
  commentId: number | null;
  info: {
    storeId: string;
    reviewId: string;
  };
  inputEditor: Dispatch<SetStateAction<boolean>> | null;
}

interface CommentsForm {
  comment: string;
}

const CommentInput = ({ commentId, info, inputEditor }: Props) => {
  const [user] = useAuthState(auth);
  const queryClient = useQueryClient();
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit: onSubmit,
    reset,
  } = useForm<CommentsForm>({
    mode: "onSubmit",
    defaultValues: {
      comment: "",
    },
  });

  const { mutate: commentMutate } = useMutation(updateComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["reviewInfo", info.storeId]);
    },
  });

  const handleSubmit = (formData: CommentsForm) => {
    if (commentId) {
      updateCommentDoc(formData);
    } else {
      createCommentDoc(formData);
    }
    reset();
  };

  const createCommentDoc = (formData: CommentsForm) => {
    if (!user) return;
    const { displayName, email, uid } = user;
    const { comment } = formData;
    const createdDate = `${new Date().toLocaleDateString(
      "en-US"
    )} ${new Date().toLocaleTimeString("en-GB")}`;
    const commentDoc: CommentProp = {
      text: comment,
      date: createdDate,
      commentId: Date.now(),
      userInfo: {
        displayName: displayName,
        email: email,
        uid: uid,
      },
      isRevised: false,
    };
    const document: UpdateCommentProp = {
      newDoc: commentDoc,
      storeId: info.storeId,
      reviewId: info.reviewId,
      commentId: null,
      newText: null,
    };
    commentMutate(document);
  };

  const updateCommentDoc = (formData: CommentsForm) => {
    const { comment } = formData;
    const document: UpdateCommentProp = {
      newDoc: null,
      storeId: info.storeId,
      reviewId: info.reviewId,
      commentId: commentId,
      newText: comment,
    };
    commentMutate(document);
    if (inputEditor) {
      inputEditor(false);
    }
  };

  return (
    <>
      {user ? (
        <form onSubmit={onSubmit(handleSubmit)} className="w-full">
          <div className="flex justify-between my-0.5">
            <input
              type="text"
              placeholder={commentId ? "" : "댓글 쓰기"}
              className="input input-bordered input-xs w-full focus:outline-none"
              maxLength={150}
              {...register("comment", {
                required: true,
              })}
            />
            <button className="btn btn-xs btn-ghost font-normal text-[11px] bg-base-200 hover:bg-base-300">
              {commentId ? "수정" : "등록"}
            </button>
          </div>
        </form>
      ) : null}
    </>
  );
};
export default CommentInput;
