def findDifference(N, nums):
    s1=0
    s2=0
    for i in nums:
        if(i%2==0):
            s1+=i
        else:
            s2+=i
        f=s1-s2
    return f