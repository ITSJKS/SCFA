def findDifference(N, nums):
    eve = 0
    odd = 0
    for i in nums:
        if i%2==0:
            eve += i
        else:
            odd += i
    return eve - odd