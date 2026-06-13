def nextGreatestLetter(letters, target):
    # for i in letters:
    #     if i > target:
    #         return i

    s = 0
    e = len(letters) - 1

    res = letters[0]
    while s <= e:
        mid = (s + e) // 2

        if letters[mid] > target and letters[mid - 1] <= target:
            return letters[mid]

        elif letters[mid] <= target:
            s = mid + 1
        else:
            e = mid - 1


    return letters[0]