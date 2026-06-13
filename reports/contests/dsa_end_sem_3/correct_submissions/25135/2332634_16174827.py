def isPowerOfTwo(n):
    if n==0:
        return False
    elif n==1 or n==2:
        return True
    if n%2==0:
        return isPowerOfTwo(n//2)
    return False