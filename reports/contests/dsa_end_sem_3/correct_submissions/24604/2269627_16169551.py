def findDifference(N, nums):
    s1=0
    s2=0
    for i in range(N):
        if nums[i]%2==0:
            s1=s1+nums[i]
        else:
            s2=s2+nums[i]

    d=(s1-s2)
    return d