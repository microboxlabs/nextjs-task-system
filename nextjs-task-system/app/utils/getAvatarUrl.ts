export function getAvatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${name.split(" ").join("+")}&size=128&background=random`;
}
