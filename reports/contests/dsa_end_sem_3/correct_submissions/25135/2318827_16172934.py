def isPowerOfTwo(n):
    if n==1:
        return True
    if n%2!=0:
        return False
    n=n//2
    if n==0:
        return False
    
    
    return isPowerOfTwo(n)