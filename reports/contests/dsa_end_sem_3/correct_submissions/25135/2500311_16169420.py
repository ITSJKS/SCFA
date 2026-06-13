def isPowerOfTwo(n):
    if n==(1.0): return True
    if n<1: return False
    return isPowerOfTwo(n/2)