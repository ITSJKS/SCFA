def findDifference(N, nums):
    oddSum = 0
    evenSum = 0

    for val in nums:
        if val % 2 == 0:
            evenSum +=val
        else:
            oddSum += val

    diff = evenSum - oddSum 
    return diff