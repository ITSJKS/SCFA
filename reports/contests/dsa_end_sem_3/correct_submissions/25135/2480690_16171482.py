def isPowerOfTwo(n):
    if n==2 or n==1:
        return True
    if n<1 or n%2!=0:
        return False
    return isPowerOfTwo(n//2)