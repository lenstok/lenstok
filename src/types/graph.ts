import * as Apollo from '@apollo/client';
import { AddReactionDocument, AddReactionMutation, AddReactionMutationVariables, CommentFeedDocument, CommentFeedQuery, CommentFeedQueryVariables, CreateCommentTypedDataDocument, CreateCommentTypedDataMutation, CreateCommentTypedDataMutationVariables, CreateCommentViaDispatcherDocument, CreateCommentViaDispatcherMutation, CreateCommentViaDispatcherMutationVariables, HasTxHashBeenIndexedDocument, HasTxHashBeenIndexedQuery, HasTxHashBeenIndexedQueryVariables, PublicationDocument, PublicationQuery, PublicationQueryVariables, RemoveReactionDocument, RemoveReactionMutation, RemoveReactionMutationVariables } from './lens';


export function useAddReactionMutation(
    baseOptions?: Apollo.MutationHookOptions<AddReactionMutation, AddReactionMutationVariables>
) {
    const options = { ...baseOptions };
    return Apollo.useMutation<AddReactionMutation, AddReactionMutationVariables>(AddReactionDocument, options);
}

export function useRemoveReactionMutation(
    baseOptions?: Apollo.MutationHookOptions<RemoveReactionMutation, RemoveReactionMutationVariables>
  ) {
    const options = { ...baseOptions };
    return Apollo.useMutation<RemoveReactionMutation, RemoveReactionMutationVariables>(
      RemoveReactionDocument,
      options
    );
}

export function useCreateCommentTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCommentTypedDataMutation,
    CreateCommentTypedDataMutationVariables
  >
){
  const options = {...baseOptions}
  return Apollo.useMutation<
    CreateCommentTypedDataMutation,
    CreateCommentTypedDataMutationVariables
  >(
    CreateCommentTypedDataDocument,
    options
  )
}

export function useCreateCommentViaDispatcherMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCommentViaDispatcherMutation,
    CreateCommentViaDispatcherMutationVariables
  >
){
  const options = {...baseOptions}
  return Apollo.useMutation<
    CreateCommentViaDispatcherMutation,
    CreateCommentViaDispatcherMutationVariables
  >(
    CreateCommentViaDispatcherDocument,
    options
  )
}

export function usePublicationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PublicationQuery, PublicationQueryVariables>
) {
  const options = { ...baseOptions };
  return Apollo.useLazyQuery<PublicationQuery, PublicationQueryVariables>(PublicationDocument, options);
}

export function useHasTxHashBeenIndexedQuery(
  baseOptions: Apollo.QueryHookOptions<HasTxHashBeenIndexedQuery, HasTxHashBeenIndexedQueryVariables>
) {
  const options = { ...baseOptions };
  return Apollo.useQuery<HasTxHashBeenIndexedQuery, HasTxHashBeenIndexedQueryVariables>(
    HasTxHashBeenIndexedDocument,
    options
  );
}

export function useHasTxHashBeenIndexedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<HasTxHashBeenIndexedQuery, HasTxHashBeenIndexedQueryVariables>
) {
  const options = { ...baseOptions };
  return Apollo.useLazyQuery<HasTxHashBeenIndexedQuery, HasTxHashBeenIndexedQueryVariables>(
    HasTxHashBeenIndexedDocument,
    options
  );
}