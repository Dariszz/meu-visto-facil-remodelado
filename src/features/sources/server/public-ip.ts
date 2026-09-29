import "server-only";
import { BlockList, isIP } from "node:net";

const excluded = new BlockList();
// Conservatively exclude special-purpose ranges, including globally reachable
// exceptions: official web servers do not need protocol/translation addresses.
// https://www.iana.org/assignments/iana-ipv4-special-registry/
const ipv4Ranges: [string, number][] = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.88.99.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
];
for (const [address, prefix] of ipv4Ranges)
  excluded.addSubnet(address, prefix, "ipv4");

const globalV6 = new BlockList();
globalV6.addSubnet("2000::", 3, "ipv6");
// https://www.iana.org/assignments/iana-ipv6-special-registry/
for (const [address, prefix] of [
  ["2001::", 23],
  ["2001:db8::", 32],
  ["2002::", 16],
  ["3fff::", 20],
] satisfies [string, number][])
  excluded.addSubnet(address, prefix, "ipv6");

export function isPublicAddress(address: string): boolean {
  if (address.includes("%")) return false;
  const family = isIP(address);
  if (family === 4) return !excluded.check(address, "ipv4");
  return (
    family === 6 &&
    globalV6.check(address, "ipv6") &&
    !excluded.check(address, "ipv6")
  );
}
