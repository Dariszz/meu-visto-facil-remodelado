import { expect, test, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { isPublicAddress } from "./public-ip";

test.each([
  "8.8.8.8",
  "1.1.1.1",
  "93.184.216.34",
  "2606:4700:4700::1111",
  "2001:4860:4860::8888",
])("accepts public unicast %s", (address) => {
  expect(isPublicAddress(address)).toBe(true);
});
test.each([
  "invalid",
  "127.1",
  "2130706433",
  "0x7f000001",
  "0.0.0.0",
  "10.255.255.255",
  "100.64.0.1",
  "100.127.255.255",
  "127.0.0.1",
  "169.254.169.254",
  "172.16.0.1",
  "172.31.255.255",
  "192.0.0.9",
  "192.0.2.1",
  "192.88.99.1",
  "192.168.1.1",
  "198.18.0.1",
  "198.19.255.255",
  "198.51.100.1",
  "203.0.113.1",
  "224.0.0.1",
  "239.255.255.255",
  "240.0.0.1",
  "255.255.255.255",
  "::",
  "::1",
  "::ffff:127.0.0.1",
  "::ffff:8.8.8.8",
  "::127.0.0.1",
  "64:ff9b::7f00:1",
  "64:ff9b:1::a00:1",
  "100::1",
  "2001::1",
  "2001:1ff::1",
  "2001:db8::1",
  "2002:7f00:1::",
  "3fff::1",
  "3fff:fff::1",
  "5f00::1",
  "fc00::1",
  "fdff::1",
  "fe80::1",
  "ff02::1",
  "fe80::1%eth0",
  "2606:4700::1%eth0",
])("rejects private, reserved, malformed or embedded address %s", (address) => {
  expect(isPublicAddress(address)).toBe(false);
});
