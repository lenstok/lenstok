import * as Apollo from '@apollo/client';
import { AddReactionDocument, AddReactionMutation, AddReactionMutationVariables, RemoveReactionDocument, RemoveReactionMutation, RemoveReactionMutationVariables } from './lens';

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