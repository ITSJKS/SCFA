def isPowerOfTwo(n):
    if n==1:
        return True
    elif n<1:
        return False
    
    return isPowerOfTwo(n/2)