
export class NotificationMessage {
  static entityHasComment(data) {
    return `<b>${data.data.title}</b> has a comment from ${data.user.username}`;
  }

  static removeFromFriends(data) {
    return `<b>${data.user.username}</b> removed you as a friend`;
  }

  static addToFriends(data) {
    return `<b>${data.user.username}</b> sent you a friend request`;
  }

  static acceptFriendRequest(data) {
    return `<b>${data.user.username}</b> accepted your friend request`;
  }

  static updateReplay(data) {
    return `<b>${data.user.username}</b> has replied to your update in <b>${data.data.title}</b>`;
  }

  static reviewReplay(data) {
    return `<b>${data.user.username}</b> has replied to your review in <b>${data.data.title}</b>`;
  }

  static entityHasReview(data) {
    return `<b>${data.data.title}</b> has a review from ${data.user.username}`;
  }

  static entityUserJoin(data) {
    return `<b>${data.user.username}</b> invites you to join <b>${data.data.title}</b> ${data.type}`;
  }

  static entityUserLeft(data) {
    return `<b>${data.user.username}</b> left <b>${data.data.title}</b> ${data.type}`;
  }

  static inviteUser(data) {
    return `<b>${data.user.username}</b> invites you to join <b>${data.data.title}</b> ${data.type}`;
  }

  static acceptInvitation(data) {
    return `<b>${data.user.username}</b> accepted your invitation to <b>${data.data.title}</b> ${data.type}`
  }

  static declineInvitation(data) {
    return `<b>${data.user.username}</b> declined your invitation to <b>${data.data.title}</b> ${data.type}`;
  }
}
