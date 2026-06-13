def isPowerOfTwo(n):
    if n == 1:
        return True
    if n < 2 and n != 1:
        return False
    return isPowerOfTwo(n/2)