def isPowerOfTwo(n):
    if n == 1:
        return True
    if n%2 != 0 or n == 0:
        return False
    if n == 2:
        return True
    return isPowerOfTwo(n//2)