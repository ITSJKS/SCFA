def isPowerOfTwo(n):
    if n==0:
        return False
    if n==1:
        return True
    elif n%2:
        return False

    return isPowerOfTwo(n//2)