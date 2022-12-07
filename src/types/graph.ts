import * as Apollo from '@apollo/client';
import { AddReactionDocument, AddReactionMutation, AddReactionMutationVariables, ApprovedModuleAllowanceAmountDocument, ApprovedModuleAllowanceAmountQuery, ApprovedModuleAllowanceAmountQueryVariables, CollectModuleDocument, CollectModuleQuery, CollectModuleQueryVariables, CollectorsDocument, CollectorsQuery, CollectorsQueryVariables, CreateCollectTypedDataDocument, CreateCollectTypedDataMutation, CreateCollectTypedDataMutationVariables, CreateCommentTypedDataDocument, CreateCommentTypedDataMutation, CreateCommentTypedDataMutationVariables, CreateCommentViaDispatcherDocument, CreateCommentViaDispatcherMutation, CreateCommentViaDispatcherMutationVariables, CreateFollowTypedDataDocument, CreateFollowTypedDataMutation, CreateFollowTypedDataMutationVariables, CreateUnfollowTypedDataDocument, CreateUnfollowTypedDataMutation, CreateUnfollowTypedDataMutationVariables, HasTxHashBeenIndexedDocument, HasTxHashBeenIndexedQuery, HasTxHashBeenIndexedQueryVariables, NftFeedDocument, NftFeedQuery, NftFeedQueryVariables, ProxyActionDocument, ProxyActionMutation, ProxyActionMutationVariables, PublicationDocument, PublicationQuery, PublicationQueryVariables, PublicationRevenueDocument, PublicationRevenueQuery, PublicationRevenueQueryVariables, RemoveReactionDocument, RemoveReactionMutation, RemoveReactionMutationVariables, TimelineDocument, TimelineQuery, TimelineQueryVariables } from './lens';


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

export function useCreateCollectTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCollectTypedDataMutation,
    CreateCollectTypedDataMutationVariables
  >
) {
  const options = { ...baseOptions };
  return Apollo.useMutation<CreateCollectTypedDataMutation, CreateCollectTypedDataMutationVariables>(
    CreateCollectTypedDataDocument,
    options
  );
}

export function useProxyActionMutation(
  baseOptions?: Apollo.MutationHookOptions<ProxyActionMutation, ProxyActionMutationVariables>
) {
  const options = { ...baseOptions };
  return Apollo.useMutation<ProxyActionMutation, ProxyActionMutationVariables>(ProxyActionDocument, options);
}

export function useCreateFollowTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateFollowTypedDataMutation,
    CreateFollowTypedDataMutationVariables
  >
) {
  const options = { ...baseOptions }
  return Apollo.useMutation<CreateFollowTypedDataMutation, CreateFollowTypedDataMutationVariables>(
    CreateFollowTypedDataDocument,
    options
  )
}

export function useCreateUnfollowTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateUnfollowTypedDataMutation,
    CreateUnfollowTypedDataMutationVariables
  >
) {
  const options = { ...baseOptions };
  return Apollo.useMutation<CreateUnfollowTypedDataMutation, CreateUnfollowTypedDataMutationVariables>(
    CreateUnfollowTypedDataDocument,
    options
  );
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

export function useTimelineQuery(
  baseOptions?: Apollo.QueryHookOptions<TimelineQuery, TimelineQueryVariables>
) {
  const options = { ...baseOptions };
  return Apollo.useQuery<TimelineQuery, TimelineQueryVariables>(
    TimelineDocument,
    options
  )
}

export function useNftFeedQuery(baseOptions: Apollo.QueryHookOptions<NftFeedQuery, NftFeedQueryVariables>) {
  const options = { ...baseOptions };
  return Apollo.useQuery<NftFeedQuery, NftFeedQueryVariables>(NftFeedDocument, options);
}
export function useNftFeedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<NftFeedQuery, NftFeedQueryVariables>
) {
  const options = { ...baseOptions };
  return Apollo.useLazyQuery<NftFeedQuery, NftFeedQueryVariables>(NftFeedDocument, options);
}

export function useCollectModuleQuery(
  baseOptions?: Apollo.QueryHookOptions<CollectModuleQuery, CollectModuleQueryVariables>
) {
  const options = { ...baseOptions }
  return Apollo.useQuery<CollectModuleQuery, CollectModuleQueryVariables>
  (CollectModuleDocument, options)
}

export function useApprovedModuleAllowanceAmountQuery(
  baseOptions?: Apollo.QueryHookOptions<ApprovedModuleAllowanceAmountQuery, ApprovedModuleAllowanceAmountQueryVariables>
) {
  const options = { ...baseOptions }
  return Apollo.useQuery<ApprovedModuleAllowanceAmountQuery, ApprovedModuleAllowanceAmountQueryVariables>
  (ApprovedModuleAllowanceAmountDocument, options)
}

export function usePublicationRevenueQuery(
  baseOptions?: Apollo.QueryHookOptions<PublicationRevenueQuery, PublicationRevenueQueryVariables>
) {
  const options = { ...baseOptions }
  return Apollo.useQuery<PublicationRevenueQuery, PublicationRevenueQueryVariables>
  (PublicationRevenueDocument, options)
}

export function useCollectorsQuery(
  baseOptions?: Apollo.QueryHookOptions<CollectorsQuery, CollectorsQueryVariables>
) {
  const options = { ...baseOptions }
  return Apollo.useQuery<CollectorsQuery, CollectorsQueryVariables>
  (CollectorsDocument, options)
}