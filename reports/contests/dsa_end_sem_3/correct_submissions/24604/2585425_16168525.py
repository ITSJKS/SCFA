def findDifference(N, nums):
    d=0
    for i in nums:
        if i%2==0:
            d+=i
        else:
            d-=i
    return d