def findDifference(N, nums):
    countsum=0
    oddsum = 0
    for val in nums:
        if val%2==0:
            countsum+=val
        else:
            oddsum+=val
    diff = countsum-oddsum
    return diff