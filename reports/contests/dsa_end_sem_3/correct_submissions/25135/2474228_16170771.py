def isPowerOfTwo(n,ans=None,i=None):
    if(ans==None):
        ans=False
    if(i==None):
        i=1
    if(i==n):
        return True
    if(i>n):
        return False
    return isPowerOfTwo(n,ans,i*2)